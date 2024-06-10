"use client"
import { FC, useEffect, useState } from 'react';
import ExcelReader from './components/ReadExcelCreate';
import ReadExcelSerial from './components/ReadExcelSerial';
import axios from 'axios';

const Createpage = () => {
  const [nameProject, setNameProject] = useState<string>("");
  const [dataSerial, setDataSerial] = useState<any[]>([]);
  const [creating, setCreating] = useState<number>(0);
  const [onLoading, setOnloading] = useState<boolean>(false);
  const [onCreating, setSuccessCreating] = useState<boolean>(false);
  const [effected, setEffected] = useState<number>(0)
  const [isChecked, setIsChecked] = useState(false);
  const [template, setTemplate] = useState<any[]>([])

  const handleCheckboxChange = (event: any) => {
    setIsChecked(event.target.checked);
    setEffected(prev => prev + 1);
    console.log('Checkbox is now:', event.target.checked ? 'Checked' : 'Unchecked');
  };

  const loadingPercent = ((creating / (dataSerial.length - 1)) * 100).toFixed(1);

  useEffect(() => {
    const datatemplate = localStorage.getItem("dataTemplate");
    const dataSerial = localStorage.getItem("dataSerial");
    if (datatemplate) {
      const parsedDatatemplate = JSON.parse(datatemplate);
      setNameProject(parsedDatatemplate[0]?.[1] || "no data");
      setTemplate(parsedDatatemplate)
    }
    if (dataSerial) {
      const parsedDataSerial = JSON.parse(dataSerial);
      setDataSerial(parsedDataSerial || []);
    }
  }, [effected]);


  const CreateProcess = async (project_name: any, serial_name: any) => {
    // setOnloading(true)
    for (let i = 1; i < template.length; i++) {
      //   setCreating(i)
      try {
        console.log(`Processing step: ${i}, serial_name: ${serial_name}`)
        const responsetemplate = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/projects/${project_name}/add_step/${serial_name}`,
          {
            name_step: template[i]?.[1],
            timestart: '-',
            endtime: '-',
            process_status: false,
            employee: []
          }
        )
        console.log('This is template', template[i]?.[1], 'updated')
      } catch (error) {
        console.log('Error creating CreateProcess', error)
      }
    }
    // setOnloading(false)
  }

  const CreateTemplateSerial = async () => {
    setOnloading(true)
    for (let i = 1; i < dataSerial.length; i++) {
      setCreating(i)
      try {
        const serialName = dataSerial[i]?.[1]
        if (!serialName) {
          console.error(`Invalid serial_name at index ${i}: ${serialName}`)
          continue
        }

        console.log(`Processing serial: ${serialName}`)
        const responsetemplatecontent = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/project/add_serial/?project_name=${nameProject}`,
          {
            serial_number: serialName,
            timestart: '-',
            endtime: '-',
            process_status: false,
            process_step: []
          }
        )
        await CreateProcess(nameProject, serialName)
        if (responsetemplatecontent.status === 200) {
          console.log('This is step', serialName, 'updated')
        }
      } catch (error) {
        console.log('Error creating template serial', error)
      }
    }
    setOnloading(false)
    setSuccessCreating(true)
  }

  const CreateTemplate = async () => {
    if (nameProject !== '') {
      try {
        const responsetemplate = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/project/create_project_head/`,
          {
            name_project_head: nameProject,
            list_serial: []
          }
        )
        if (responsetemplate.status === 201) {
          await CreateTemplateSerial()
        }
      } catch (error) {
        console.log('Error creating template', error)
      }
    }
  }
  return (
    <section id="create_page" className="overflow-x-auto relative p-4 bg-gray-700 whitespace-nowrap h-screen min-w-full transition duration-500 ease-in-out">
      {onLoading && (
        <div className="w-full h-screen flex items-center justify-center bg-opacity-90 bg-gray-900 absolute top-0 left-0 z-50">
          <p className='text-white font-bold z-50'>กำลังสร้าง Serial: {loadingPercent}%</p>
        </div>
      )}
      {onCreating && (
        <div className="w-full h-screen flex items-center justify-center bg-opacity-90 bg-gray-900 absolute top-0 left-0 z-50 ">
          <div className='bg-gray-700 p-12 relative rounded-md'>
            <p className='text-white font-bold z-50'>ดำเนินการเสร็จสิ้น</p>
            <button onClick={() => { setSuccessCreating(false) }} className='absolute top-1 right-2 text-white'>X</button>
          </div>
        </div>
      )}
      <div className='bg-gray-600 p-4 space-y-4 rounded-md'>
        <ExcelReader />
        <ReadExcelSerial />
        {/* <p>{nameProject || "not found project name"}</p> */}
        {/* <p>{dataSerial[1]?.[1] || "not found data serial name"}</p> */}
        <label className="flex items-center">
          <input type="checkbox" className="accent-orange-500 w-[20px] h-[20px]"
            checked={isChecked}
            onChange={handleCheckboxChange} />
          <span className='px-2 text-white'>โปรดยืนยันก่อนสร้างโปรเจค</span>
        </label>
        {isChecked &&
          <button onClick={CreateTemplate} className='w-full bg-orange-500 focus:scale-105 drop-shadow-lg rounded-md p-3 text-white'>
            สร้างโปรเจค {nameProject}
          </button>
        }
      </div>
    </section>
  );
};

export default Createpage;
