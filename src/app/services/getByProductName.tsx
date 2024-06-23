import axios from 'axios';
import { Projects } from './type';

const GerByProductName = async (name_project: string): Promise<{ data: Projects[] }> => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/search_project_name/${name_project}`, {
            headers: {
                'Accept': 'application/json',
            },
        });
        console.log(response.data)
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
};

export default GerByProductName;
