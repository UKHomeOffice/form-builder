import axios from "axios";
import * as express from 'express';

export class FormUtil {
    public async createForm(headers: any, form: any, envContext: any): Promise<express.Response> {
        let response;
        if (envContext.approvalUrl) {
            response = await axios({
                url: `${envContext.approvalUrl}`,
                method: 'POST',
                data: form,
                headers: headers
            });
        } else {
            try {
                response = await axios({
                    url: `${envContext.url}/form`,
                    method: 'POST',
                    data: form,
                    headers: headers
                });
            } catch (e) {
                throw e.response.data;
            }
        }

        return response;
    };
}
