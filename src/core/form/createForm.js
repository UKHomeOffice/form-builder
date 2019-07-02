const createForm = async (axios,
                          envContext,
                          form,
                          log,
                          headers = {}) => {

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
                url: `${envContext.url}/forms`,
                method: 'POST',
                data: form,
                headers: headers
            });
        } catch (e) {
            return Promise.reject(e.response.data);
        }
    }

    return response;
};

export default createForm;
