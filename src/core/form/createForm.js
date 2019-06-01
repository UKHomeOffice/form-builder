const createForm = async (axios,
                          envContext,
                          form,
                          submissionAccess,
                          log,
                          headers = {}) => {

    const anonymous = await axios({
        method: 'GET',
        headers: headers,
        url: `${envContext.url}/role?machineName=anonymous`,
    });
    form['submissionAccess'] = submissionAccess(anonymous.data[0]._id);

    let response;
    if (envContext.approvalUrl) {
        response = await axios({
            url: `${envContext.approvalUrl}`,
            method: 'POST',
            data: form,
            headers: headers
        });
    } else {
        response = await axios({
            url: `${envContext.url}/form`,
            method: 'POST',
            data: form,
            headers: headers
        });

        const formId = response.data._id;
        const actions = await axios({
            url: `${envContext.url}/form/${formId}/action`,
            method: 'GET',
            headers: headers
        });

        const deleteAction = (action) => {
            return axios({
                url: `${envContext.url}/form/${response.data._id}/action/${action._id}`,
                method: 'DELETE',
                headers: headers
            });
        };

        if (actions.data.length >= 1) {
            await Promise.all(actions.data.map((action) => deleteAction(action)));
            log([{
                message: `Deleted actions for ${formId}`,
                level: 'info'
            }]);
        }
    }

    return response;
};

export default createForm;
