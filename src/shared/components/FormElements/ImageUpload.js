import React, {useRef, useState, useEffect} from "react";

import Button from './Button'
import './ImageUpload.css';

const ImageUpload = props => {
    const [file, setFile] = useState();
    const [previewUrl, setPreviewUrl] = useState();
    const[isValid,setIsValid] = useState(false);

    //click on and utilize hidden image upload form by clicking on button
    const filePickerRef = useRef();

    useEffect(()=>{
        if(!file){
            return;
        }
        // api build into browser
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    },[file]);

    const pickedHandler = event => {
        // event.target.files.length - array, we expect 1 file
        let pickedFile;
        // lect 166 4:30 since setFile will be updated only after compounent re-rander, new var for validation is used 
        let fileIsValid = isValid;
        if (event.target.files && event.target.files.length === 1){
            pickedFile = event.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        }else{
            
            setIsValid(false);
            fileIsValid = false;
        }
        props.onInput(props.id, pickedFile, fileIsValid);
    };

    const pickImageHandler = () => {
        filePickerRef.current.click()
    };

    return (
        <div className="form-control">
            {/* //display:'none' make it invisible */}
            <input
                id={props.id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview"/>}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    )
};

export default ImageUpload;