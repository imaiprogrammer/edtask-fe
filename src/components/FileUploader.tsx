import { useCallback } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";

interface FileUploderProps {
    onUpload: (files: File[]) => void;
    uploadedFiles?: File[] | undefined;
    maxFiles?: number;
}

const FileUploader: React.FC<FileUploderProps> = ({ onUpload, uploadedFiles,  maxFiles = 1 }) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {
        onUpload(acceptedFiles);
    }, [onUpload]);

    const dropOptions: DropzoneOptions = {
        onDrop,
        accept: {
            'text/csv': ['.csv'],
        },
        maxFiles
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone(dropOptions);

    return (
        <div>
            <div {...getRootProps()}
                className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer  ${isDragActive ? 'border-blue-500' : 'border-gray-300'}`}
            >
                <input {...getInputProps()} />

                <div className="text-center">
                    {
                        isDragActive ? (<p className="text-blue-500"> Drop the files here....</p>) : (
                            <p className="text-gray-500"> Drag and drop or Click </p>
                        )
                    }
                </div>
            </div>
            {uploadedFiles && uploadedFiles?.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Uploaded Files: </h2>
                        <ul className="list-disc list-inside">
                            {uploadedFiles?.map((file, index) => (
                                <li key={index} className="text-gray-700">{file.name}</li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    )
}


export default FileUploader