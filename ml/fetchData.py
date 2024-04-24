import os

os.environ['KAGGLE_USERNAME'] = "username"
os.environ['KAGGLE_KEY'] = "key"

def download(type="data"):
    if(not os.path.isdir(os.getcwd()+"//"+type)):
        os.mkdir(type)
    else:
        print(type + " folder already created")
    import kaggle 
    os.chdir(os.getcwd()+"//"+type)
    if type=="data":
        print("Downloading the required data to " + os.getcwd())
        kaggle.api.dataset_download_files('sshikamaru/car-object-detection', path=os.getcwd(), unzip=True)
    else:
        print("Downloading the model files to : " + os.getcwd())
        kaggle.api.dataset_download_files('alessiopeluso/yolov3', path=os.getcwd(), unzip=True)
    print("Download Finished.")
    print("="*100)
    os.path.dirname(os.path.dirname(os.getcwd()))

if __name__=="__main__":
    download("data")
    download("model")