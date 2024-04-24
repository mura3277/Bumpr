from os import getcwd
import numpy as np
import cv2
from PIL import Image

def loadModel():
    """ Loads in the YOLO model """
    print("Loading in the weights from:", getcwd()+"/ml-model/yolov3.weights")
    NN = cv2.dnn.readNet(getcwd()+"/ml-model/yolov3.weights", getcwd()+"/ml-model/yolov3.cfg")
    targetClasses = []
    with open(getcwd()+"/ml-model/coco.names") as f:
        targetClasses = f.read().split('\n')
        # Remove the last potential target class
        del targetClasses[len(targetClasses)-1]
    
    return NN, targetClasses

def predict(img):
    """ Takes image array as input """
    # Convert RGB to BGR, they process the colours in a different order 
    img = img[:, :, ::-1].copy() 
    
    model, classes = loadModel()
    width, height = img.shape[1], img.shape[0]
    totalArea = width*height

    
    blob = cv2.dnn.blobFromImage(img, 1/256, (416, 416), (0, 0, 0), swapRB=True, crop=False)

    model.setInput(blob)
    output_layers_names = model.getUnconnectedOutLayersNames()
    layerOutputs = model.forward(output_layers_names)

    # lengths and widths
    boxes = []
    # The confidence with which they're present
    confidences = []
    
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
                
    # Boiler plate code to add the bounding boxes 
    indices = cv2.dnn.NMSBoxes(boxes, confidences, threshold, 0.45) # threshold - maximum suppression
    
    carArea = 0
    confidence = 0
    for i in indices:
        x, y, w, h = boxes[i]
        confidence = max(round(confidences[i], 2),confidence)
        print("Model's Confidence of a Car's Presence: " + str(confidence))
        carArea+= w*h
        
    
    carAreaPercentage = carArea/totalArea
    if len(indices) == 0:
        return False, "Car not found"
    elif carAreaPercentage<.1:
        return False, "Car needs to be a larger part of the image"
    else:
        return True, "Success"
    
    