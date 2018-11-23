import io
import os
import cv2
import uuid
import flask
import argparse
import numpy as np

ALLOWED_EXTENSIONS = set(['pdf', 'png', 'jpg', 'jpeg', 'gif'])

app = flask.Flask(__name__)


def analyze_image(filepath, filename):
    img_path = os.path.join(filepath, filename)
    # 184 pixeles = 60um
    # 60/184 = 0.33 um/perPixel
    original = cv2.imread(img_path)
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
    # Make background the foreground
    ret, thresh = cv2.threshold(gray,0,255,cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)
    kernel = np.ones((3,3),np.uint8)
    # Dilate the foreground (==background)
    thresh = cv2.dilate(thresh,kernel,iterations=7)
    # Invert blacks and whites to set foreground as background
    thresh = cv2.bitwise_not(thresh)
    # Find Countours
    contours = cv2.findContours(thresh, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)[1]
    # Get last Y in contours (closest to origin 0,0)
    _,y,_,_ = cv2.boundingRect(contours[-1])
    # Set maximum allowed Y (10%)
    maxy = y*1.1
    # Total area
    total = 0
    # topCountours = []
    maxH = 0
    # Find countours with range (0 -> maxy)
    for c in reversed(contours):
        _,y,_,h = cv2.boundingRect(c)
        if(y > maxy): break
        total += cv2.contourArea(c)
        maxH = max(maxH,y+h)
        cv2.drawContours(original, c, -1, (255,0,0), 5)
    

    # Crop bottom part of image
    crop_img = original.copy()[maxH:maxH+original.shape[0], 0:original.shape[1]]
    countoursBottom = getBottomContours(crop_img)
    cv2.drawContours(original, countoursBottom, -1, (0,0,255), 3, offset=(0,maxH))
    totalBottom = 0
    for c in countoursBottom:
        totalBottom += cv2.contourArea(c)
    
    cv2.imwrite(os.path.join(app.config['ANALYZED_FOLDER'], filename), original)

    # print("Area: " + str(total*0.33) + " um^2", "Bottom Area: ", str(totalBottom*0.33))
    return total*0.33, totalBottom*0.33
    
def getBottomContours(image):
    # Up threshold for beter detection of features
    image = cv2.threshold(image, 150, 255, cv2.THRESH_BINARY)[1]
    # Convert to Grayscale for countour detection
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # Find Countours
    contours = cv2.findContours(image, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)[1]
    return contours
    
        
def allowed_file(filename):
    ext = filename.rsplit('.', 1)[1].lower()
    if '.' in filename and ext in ALLOWED_EXTENSIONS:
        return '.' + ext
    
    
@app.route("/analyze", methods=["POST"])
def analyze():
    data = {"success": False, "error": None}
    try:
        # ensure an image was properly uploaded to our endpoint
        if flask.request.method == "POST":
            image = flask.request.files["image"]
            if image.filename == '':
                data['error'] = 'No selected file'
            ext = allowed_file(image.filename)
            if image and ext:
                filename = str(uuid.uuid4().hex) + ext
                filepath = app.config['UPLOAD_FOLDER']
                image.save(os.path.join(filepath, filename))
                peakArea, bottomArea = analyze_image(filepath, filename)
                data["results"] = {}
                data["results"]["peakArea"] = peakArea
                data["results"]["bottomArea"] = bottomArea
                data["results"]["filename"] = filename
                data["form"] = flask.request.form
            else:
                data['error'] = 'Invalid image'
    except Exception as e:
        data['error'] = str(e)
    
    return flask.jsonify(data)




if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Flask server that analyzes microscopic metal images')
    parser.add_argument('upload_folder',help='Path to original images')
    parser.add_argument('analyzed_folder',help='Path to analyzed images')
    args = parser.parse_args()

    app.config['UPLOAD_FOLDER'] = args.upload_folder
    app.config['ANALYZED_FOLDER'] = args.analyzed_folder
    
    app.run(debug=False)

