export default class DadataRequest {

    constructor() {
        this.url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
        this.token = "372565fb8d533723c7cfb469cdb563385e3e7670";

        this.options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": "Token " + this.token
            }
        }
    }

    async send(query) {
        try {
            this.options.body = JSON.stringify({
                query: query
            });
            let response = await fetch(this.url, this.options);
            return await response.json();
        } catch (error) {
            console.error(error);
        }
    }
}
