// types.ts
export interface Employee {
    name: string;
    list_break: Listbreak[];
}

export interface Listbreak {
    describe: string;
    start_break: string;
    end_break: string;
}

export interface Processstep {
    name_step: string;
    timestart: string;
    endtime: string;
    process_status: boolean;
    employee: Employee[];
}

export interface Listserial {
    serial_number: string;
    timestart: string;
    endtime: string;
    process_status: boolean;
    process_step: Processstep[];
}

export interface Projects {
    name_project_head: string;
    list_serial: Listserial[];
}
