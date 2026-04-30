import {type FormEvent, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File  }) => {
        setIsProcessing(true);

        setStatusText('Processing document...');
        const uploadFilePromise = fs.upload([file]);
        const uploadImagePromise = convertPdfToImage(file).then(async (res) => {
            if (!res.file) throw new Error('Failed to convert PDF to image');
            return fs.upload([res.file]);
        });

        let uploadedFile, uploadedImage;
        try {
            [uploadedFile, uploadedImage] = await Promise.all([uploadFilePromise, uploadImagePromise]);
        } catch (err: any) {
            return setStatusText(err.message || 'Error occurred during upload');
        }

        if(!uploadedFile) return setStatusText('Error: Failed to upload file');
        if(!uploadedImage) return setStatusText('Error: Failed to upload image');

        setStatusText('Preparing data...');
        const uuid = generateUUID();
        const data = {
            id: uuid,
            resumePath: uploadedFile.path,
            imagePath: uploadedImage.path,
            companyName, jobTitle, jobDescription,
            feedback: '',
        }
        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText('Analyzing...');

        const feedback = await ai.feedback(
            uploadedFile.path,
            prepareInstructions({ jobTitle, jobDescription })
        )
        if (!feedback) return setStatusText('Error: Failed to analyze resume');

        const feedbackText = typeof feedback.message.content === 'string'
            ? feedback.message.content
            : feedback.message.content[0].text;

        const cleanedText = feedbackText.replace(/```json/g, '').replace(/```/g, '').trim();

        data.feedback = JSON.parse(cleanedText);
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setStatusText('Analysis complete, redirecting...');
        console.log(data);
        navigate(`/resume/${uuid}`);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, file });
    }

    return (
        <main>
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8 w-full max-w-2xl bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-sm border border-gray-100 text-left mx-auto">
                            <div className="flex flex-col md:flex-row gap-6 w-full">
                                <div className="form-div flex-1">
                                    <label htmlFor="company-name" className="font-semibold text-gray-700 ml-1">Company Name</label>
                                    <input type="text" name="company-name" placeholder="e.g. Google" id="company-name" />
                                </div>
                                <div className="form-div flex-1">
                                    <label htmlFor="job-title" className="font-semibold text-gray-700 ml-1">Job Title</label>
                                    <input type="text" name="job-title" placeholder="e.g. Frontend Engineer" id="job-title" />
                                </div>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description" className="font-semibold text-gray-700 ml-1">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Paste the job description here..." id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader" className="font-semibold text-gray-700 ml-1">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button mt-4 hover:scale-[1.02] hover:shadow-lg transition-all py-4 text-lg font-bold" type="submit">
                                Analyze Resume
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
