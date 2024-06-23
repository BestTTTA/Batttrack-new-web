import axios from 'axios';
import { Projects } from './type';

const GetProjects = async (): Promise<{ data: Projects[] }> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/projects`, {
            headers: {
                'Accept': 'application/json',
            },
        });
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export default GetProjects;
