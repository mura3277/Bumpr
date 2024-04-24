"""
The reason this file is evaluate and not train is because the model is pre-trained, in the future I intend 
to write a separate PyTorch YOLO NN to accomplish this task. This, however, will suffice to show the effectiveness of 
the model/approach.

Preliminarily this approach will use a pretrained model using the You Only Look Once model architecture.
And this firs solution is akin to: https://www.kaggle.com/alessiopeluso/basic-yolo
For more information on YOLO: 
    https://www.pyimagesearch.com/2018/11/12/yolo-object-detection-with-opencv/
    https://arxiv.org/pdf/1506.02640.pdf
Currentl using OpenCv, but will migrate to PyTorch soon.
"""
import cv2
import numpy as np
from matplotlib import pyplot as plt
from os import walk, getcwd, path, mkdir, isdir
from random import randint

def loadModel():
    """ Loads in the downloaded model """
    NN = cv2.dnn.readNet(getcwd()+"//model//yolov3.weights", getcwd()+"//model//yolov3.cfg")
    targetClasses = []
    with open(getcwd()+"//model//coco.names") as f:
        targetClasses = f.read().split('\n')
        # Remove the last potential target class
        del targetClasses[len(targetClasses)-1]
    
    return NN, targetClasses

def individualImage(model=None, classes=["car"], img=None, verbose=False):
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
    # The corresponding type of class 
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
        if verbose:
            print(x, y, w, h)
        confidence = str(round(confidences[i], 2))
        color = colors[i]
        cv2.rectangle(img, (x, y), ((x+w), (y+h)), color, 2)
        cv2.putText(img, "car" + " " + confidence, (x, y+20), font, 2, (0, 255, 0), 2)

    return img

def evaluateOn(type="train", all=False, model=None, classes=["car"]):
    images = []
    desiredPath = getcwd()+"//data//"+type+"ing_images//"
    for (dirpath, dirnames, filenames) in walk(desiredPath):
        images= images+filenames
    print("There are " + str(len(images)) + " " + type + "ing images.")
    if not all:
        print("Selecting a random image to evalute the model on")
        # Selecting a random image
        img = cv2.imread(desiredPath+images[randint(0,len(images)-1)])
        # img = cv2.imread(path+'vid_4_940.jpg') - useful testcase
        img = individualImage(model,classes, img)
        print("Saved the model's output to example.jpg")
        cv2.imwrite("example.jpg", img)
    else:
        if(not path.isdir(getcwd()+"//outputImages")):
            mkdir(getcwd()+"//outputImages")
            print("Created outputImages directory")
        else:
            print("Output folder already created")
        for i in images:
            print("Currently on " + type + i)
            img = cv2.imread(desiredPath+i)
            img = individualImage(model,classes, img)
            cv2.imwrite(getcwd()+"//outputImages//"+i, img)
        


def main():
    model, classes = loadModel()
    # Test on Signle Images
    # evaluateOn("train", False, model, classes, True)
    # evaluateOn("test", False, model, classes, True)
    evaluateOn("train", True, model, classes)
    evaluateOn("test", True, model, classes)

if __name__=="__main__":
    # assertions that fetchData has been run
    assert(isdir(getcwd()+"//model//"))
    assert(isdir(getcwd()+"//data//"))
    main()