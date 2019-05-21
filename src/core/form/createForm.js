const createForm = async (axios,
                          envContext,
                          form,
                          submissionAccess,
                          log) => {

    const anonymous = await axios({
        method: 'GET',
        url: `${envContext.url}/role?machineName=anonymous`,
    });
    form['submissionAccess'] = submissionAccess(anonymous.data[0]._id);

    const response = await axios({
        url: `${envContext.url}/form`,
        method: 'POST',
        data: form
    });

    const formId = response.data._id;
    const actions = await axios({
        url: `${envContext.url}/form/${formId}/action`,
        method: 'GET'
    });

    const deleteAction = (action) => {
        return axios({
            url: `${envContext.url}/form/${response.data._id}/action/${action._id}`,
            method: 'DELETE'
        });
    };

    if (actions.data.length >= 1) {
        await Promise.all(actions.data.map((action) => deleteAction(action)));
        log([{
            message: `Deleted actions for ${formId}`,
            level: 'info'
        }]);
    }
    return response;
};

export default createForm;
