import { AxiosResponse } from "axios"

export const isOk = (response: AxiosResponse) => {
	return 199 < response.status && response.status < 300
}
