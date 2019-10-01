import axios from 'axios';

class FileService {

    constructor(keycloak, envContext, keycloakTokenProvider) {
        this.keycloak = keycloak;
        this.envContext = envContext;
        this.keycloakTokenProvider = keycloakTokenProvider;
    }

    async uploadFile(storage, file, fileName, dir, evt, url, options) {
        const fd = new FormData();
        const data = {
            file: file,
            name: fileName,
            dir: dir
        };
        const json = (typeof data === 'string');

        if (!json) {
            for (const key in data) {
                fd.append(key, data[key]);
            }
        }
        const token = await this.keycloakTokenProvider.fetchKeycloakToken(this.envContext, this.keycloak);
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
            onUploadProgress: function (progressEvent) {
                evt({
                    total: progressEvent.total,
                    loaded: progressEvent.loaded
                });
            }
        };
        const response = await axios.post(url, data, config);
        return {
            storage: 'url',
            fileName,
            url: response.data.url,
            size: file.size,
            type: file.type,
            data: response.data
        };
    }

    async deleteFile(fileInfo) {
        const token = await this.keycloakTokenProvider.fetchKeycloakToken(this.envContext, this.keycloak);
        return new Promise((resolve, reject) => {
            axios.delete(fileInfo.url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    resolve('File deleted');
                }
            }).catch((e) => {
                reject(e);
            });
        })
    }

    async downloadFile(fileInfo, options) {
        const token = await this.keycloakTokenProvider.fetchKeycloakToken(this.envContext, this.keycloak);
        return new Promise((resolve, reject) => {
            axios({
                url: fileInfo.url,
                method: 'GET',
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((response) => {
                const file = new Blob([response.data]);
                const fileURL = URL.createObjectURL(file);
                const link = document.createElement('a');
                link.href = fileURL;
                link.setAttribute('download', `${fileInfo.originalName}`);
                document.body.appendChild(link);
                link.click();
                resolve();
            }).catch((e) => {
                reject(e);
            })
        });
    }
}

export default FileService;
