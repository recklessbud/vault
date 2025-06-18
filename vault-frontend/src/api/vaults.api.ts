import axios, { AxiosResponse } from 'axios'
import { toast } from 'sonner'

axios.defaults.withCredentials = true


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
 
export const getVault = async() => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = axios.get(`${BACKEND_URL}/vaults`)
         return (await response).data
    } catch (error) {
    const errorMessage = error?.response?.data?.message || "Could not Fetch vaults";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);

    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createVaultApi = async (vaultData:any, isFormData = false) => {
    try {
        console.log("vaultdata:", vaultData)
        const config = isFormData ? {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        
        } : {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: AxiosResponse<any> = await axios.post(`${BACKEND_URL}/vaults/upload`, vaultData, config, )
         return response.data
    } catch (error) {
    const errorMessage = error?.response?.data.message || "Could not create Vaults";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);

    }
    
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateVaultApi = async(vaultId: string, vaultData: any, isFormData = false) => {
    try {
        const config = isFormData ? {headers: {'Content-Type': 'multipart/form-data'}} : {};
        const response = await axios.put(`${BACKEND_URL}/vaults/${vaultId}/update`, vaultData, config)
        return response.data
    } catch (error) {
    const errorMessage = error?.response?.data.message || "Could not Update vaults, Please try again later";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
    }
}

export const deleteVaultApi = async(vaultId: string) => {
    try {
        const response = await axios.delete(`${BACKEND_URL}/vaults/${vaultId}/delete`)
        return response.data
    } catch (error) {
    const errorMessage = error?.response?.data.message || "Could not Delete vaults, Please try again later";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
    }
}

export const getSingleVaultApi = async(vaultId: string) => {
  try {
      const response = await axios.get(`${BACKEND_URL}/vaults/${vaultId}/details`)
      return response.data
  } catch (error) {
    const errorMessage = error?.response?.data.message || "Could not Fetch vault, Please try again later";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
  }
}

export const getUsersApi = async() => {
  try {
      const response = await axios.get(`${BACKEND_URL}/vaults/users`)
      return response.data
  } catch (error) {
    const errorMessage = error?.response?.data.message || "Could not Fetch vaults, Please try again later";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
  }
}

export const shareVaultsApi = async(capsuleId: string, recipientName: string, ) => {
  try {
      const response = await axios.post(`${BACKEND_URL}/vaults/${capsuleId}/share`, {recipientName})
      return response.data
  } catch (error) {
      console.log(error)
      throw new Error("Could not Fetch vaults, Please try again later")
  }
}

export const getSharedVaultApi = async() => {
  try {
      const response = axios.get(`${BACKEND_URL}/vaults/shared`)
    //   console.log('response:', response.data)
      return (await response).data
  } catch (error) {
    const errorMessage = error?.response?.data.message || "Could not Fetch SHared vaults, Please try again later";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
  }
}

export const getSharedVaultCountApi = async() => {
    try {
        const response = await axios.get(`${BACKEND_URL}/vaults/shared/total-count`)
        return response.data
    } catch (error) {
      console.log(error)
    const errorMessage = error?.response?.data.message || "Could not Count shared vaults, Please try again later";
    if (error.response?.status === 429) {
      alert("Too many requests. Please wait a while before trying again.");
    }
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
    }
}


export const downloadfile = async(fileId: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/vaults/details/${fileId}/download`);
    console.log('Download response:', response.data.downloadFile);
                   
    if (response.data.downloadFile) {
       const link = document.createElement('a');
       link.href = response.data.downloadFile;
       link.download = response.data.fileName || 'download';
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
      }
  } catch (error) {
    const errorMessage = error?.response?.data.message || "Could not Download file, Please try again later";
    console.log('[ERROR]:', errorMessage);
    toast.error(errorMessage);
  }
}