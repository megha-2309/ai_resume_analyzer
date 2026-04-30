import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;

        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    const file = acceptedFiles[0] || null;



    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer flex-1">
                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="pdf" className="size-10" />
                            <div className="flex items-center space-x-3 w-full">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-700 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 cursor-pointer hover:bg-gray-200 rounded-full transition-colors" onClick={(e) => {
                                onFileSelect?.(null);
                                e.stopPropagation();
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4 opacity-60" />
                            </button>
                        </div>
                    ): (
                        <div className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center min-h-[200px] bg-white hover:bg-gray-50 ${isDragActive ? 'border-indigo-500 bg-indigo-50/30' : 'border-gray-300'}`}>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-3 bg-indigo-50 rounded-full">
                                <img src="/icons/info.svg" alt="upload" className="size-8 opacity-80" />
                            </div>
                            <p className="text-md text-gray-600 mb-1">
                                <span className="font-semibold text-indigo-600">
                                    Click to upload
                                </span> or drag and drop
                            </p>
                            <p className="text-sm text-gray-400">PDF (max {formatSize(maxFileSize)})</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader
