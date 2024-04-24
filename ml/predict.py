from os import path, getcwd
import numpy as np
import cv2
import sys

def loadModel():
    """ Loads in the downloaded model """
    NN = cv2.dnn.readNet(getcwd()+"//model//yolov3.weights", getcwd()+"//model//yolov3.cfg")
    targetClasses = []
    with open(getcwd()+"//model//coco.names") as f:
        targetClasses = f.read().split('\n')
        # Remove the last potential target class
        del targetClasses[len(targetClasses)-1]
    
    return NN, targetClasses

def predict(model=None, classes=["car"], img=None, verbose=False):
    width, height = img.shape[1], img.shape[0]
    if verbose:
        print("Their width x height are as follows: ", width, height)
    # Displaying the random image
    # plt.imshow(img)
    # plt.show()
    blob = cv2.dnn.blobFromImage(img, 1/256, (416, 416), (0, 0, 0), swapRB=True, crop=False)

    model.setInput(blob)
    output_layers_names = model.getUnconnectedOutLayersNames()
    layerOutputs = model.forward(output_layers_names)

    # The Generated Bounding boxes for the images
    boxes = []
    # The confidence with which they're present
    confidences = []
    # The corresponding tpe of class 
    class_ids = []
    # loop over the layer output
    # first to extract info form the layer output
    # second loop extract info from each output
    threshold = 0.7
    for output in layerOutputs:
        for detection in output:
            # first four elements are the location of the bounding box
            # fifth element is the confidence
            # from sixth to end the object predictions
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence>threshold and classes[class_id]=="car":
                # if the NN's confidnece is greater than .7 
                # must rescale the bounding boxes to be applicable to the image in its totality
                center_x = int(detection[0]*width)
                center_y = int(detection[1]*height)
                w = int(detection[2]*width)
                h = int(detection[3]*height)
                # position of the upper left corner
                x = int(center_x - w/2)
                y = int(center_y - h/2)

                boxes.append([x, y, w, h])
                # We want the confidence level and what object it is
                confidences.append(float(confidence))
                class_ids.append(class_id)
    # Boiler plate code to add the bounding boxes 
    indices = cv2.dnn.NMSBoxes(boxes, confidences, threshold, 0.45) # threshold - maximum suppression

    font = cv2.FONT_HERSHEY_PLAIN
    colors = np.random.uniform(0, 255, size=(len(boxes), 3))

    for i in indices:
        x, y, w, h = boxes[i]
        
        print(x, y, w, h)
        confidence = str(round(confidences[i], 2))
        print("Car Confidnce: " + str(confidence))
        color = colors[i]
        cv2.rectangle(img, (x, y), ((x+w), (y+h)), color, 2)
        cv2.putText(img, "car" + " " + confidence, (x, y+20), font, 2, (0, 255, 0), 2)

    return img

def main(filePath):
    model, classes = loadModel()
    img = cv2.imread(filePath)
    img = predict(model, classes, img, False)
    print(getcwd())
    cv2.imwrite(getcwd()+"//outputTmp.jpg", img)

if __name__ == "__main__":
    assert(len(sys.argv)==2)
    # assertions that fetchData has been run
    assert(path.isdir(getcwd()+"//model//"))
    assert(path.isdir(getcwd()+"//data//"))
    main(sys.argv[1])