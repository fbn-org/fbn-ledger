import { useCallback } from 'react';

import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';

export default function useRequest() {
    const { enqueueSnackbar } = useSnackbar();
    const { data: session } = useSession();

    const request = useCallback(
        (url, data) => {
            return new Promise((resolve, reject) => {
                fetch(url, {
                    ...data
                })
                    .then((res) => {
                        if (res.status === 200) {
                            return res.json() || {};
                        } else if (res.status === 401) {
                            return res.json().then((json) => {
                                enqueueSnackbar(json.message, {
                                    variant: 'error'
                                });
                                throw new Error(json.message);
                            });
                        } else {
                            reject(res.json());
                        }
                    })
                    .catch((err) => {
                        console.log('rejected', err);
                        reject(err);
                    })
                    .then((data) => {
                        resolve(data);
                    });
            });
        },
        [enqueueSnackbar]
    );

    return request;
}
