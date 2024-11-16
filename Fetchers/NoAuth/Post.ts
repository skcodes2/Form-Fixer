
import { header } from "./Get.js"

export default function Post(url: string, data: any, errorHandler: () => {}, responseHandler?: () => {}) {

    fetch(url, { method: "POST", headers: header, body: JSON.stringify(data) })
        .then(response => {
            if (!response.ok) {
                errorHandler()
                return
            }
            response.json()
        })
        .then(data => {
            if (responseHandler) {
                responseHandler()
            }
        })

        .catch(error => {
            console.log(error)
            errorHandler()
        })

}