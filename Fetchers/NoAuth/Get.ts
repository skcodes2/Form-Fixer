


export let header = {
    "Content-Type": "application/json"
}

export default function Get(url: string, setter: (data: any) => void, errorHandler: () => void) {

    fetch(url, { method: "GET", headers: header })

        .then(response => {
            if (!response.ok) {
                errorHandler()
                return
            }

            response.json()

        })

        .then(data => setter(data))

        .catch(error => {
            console.log(error)
            errorHandler()
        })
}


