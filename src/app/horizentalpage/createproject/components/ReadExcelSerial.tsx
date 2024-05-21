import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ReadExcelSerial() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [fileNameserial, setFileNameserial] = useState<string>('');
    const [rowCount, setRowCount] = useState<number>(0);


    const handleFileserial = (file: File) => {
        setLoading(true);
        setFileNameserial(file.name);
        const reader = new FileReader();
        reader.onload = async (evt: ProgressEvent<FileReader>) => {
            try {
                localStorage.removeItem("dataSerial")
                const bstr = evt.target?.result as string;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });
                setError('');
                localStorage.setItem("dataSerial",JSON.stringify(data))
                console.log(JSON.stringify(data))
                if (data.length > 0) {
                    const sequenceIndex = data[0].indexOf('ลำดับ');
                    if (sequenceIndex !== -1) {
                        // Filter out the header row and count unique entries in the 'ลำดับ' column
                        const sequenceSet = new Set(data.slice(1).map(row => row[sequenceIndex]));
                        setRowCount(sequenceSet.size);  // Set row count based on unique 'ลำดับ' entries
                    } else {
                        console.error('Column "ลำดับ" not found');
                    }
                } else {
                    setRowCount(0);
                }
            } catch (e) {
                setError('Failed to read or process file');
            }
            setLoading(false);
        };
        reader.onerror = () => {
            setError('Error reading the file');
            setLoading(false);
        };
        reader.readAsBinaryString(file);
    };

    const handleChangeserial = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileserial = e.target.files;
        if (fileserial && fileserial[0]) {
            handleFileserial(fileserial[0]);
        }
    };

    return (
        <div className='w-full h-fit'>
            {!loading ? (
                <div className='w-full h-fit'>
                    <input
                        type="file"
                        id="file-input-serial"
                        onChange={handleChangeserial}
                        accept=".xlsx,.xls"
                        hidden
                    />
                    <label
                        htmlFor="file-input-serial"
                        className="p-2 relative text-sm text-white cursor-pointer w-full flex items-center justify-center border border-dashed rounded-lg h-32"
                    >
                        {fileNameserial ? `Loaded: ${fileNameserial}` : "เลือกSerial +"}
                    </label>
                </div>
            ) : (
                <div className='w-full h-fit'>
                    <input
                        type="file"
                        id="file-input-serial"
                        onChange={handleChangeserial}
                        accept=".xlsx,.xls"
                        hidden
                    />
                    <label
                        htmlFor="file-input-serial"
                        className="relative text-white cursor-pointer w-full flex items-center justify-center border border-dashed rounded-lg h-32"
                    >
                        Loading...
                    </label>
                </div>
            )}
            <p className='text-white'>จำนวน Serials ทั้งหมด {rowCount}</p>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default ReadExcelSerial;
