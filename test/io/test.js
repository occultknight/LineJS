line.module([
    'io.HttpClient'
], function (HttpClient) {
    HttpClient.request('data/data.json', {
        type: 'json',
        success: function (data) {
            console.log(data);
        }
    });

    HttpClient.request('data/app.js', {
        type: 'json',
        success: function (d) {
            console.log(d);
        },
        error: function (e) {
            console.log(e);
        }
    });

    HttpClient.request('data/app.js', {
        type: 'script',
        success: function (d) {
            console.log(d);
        },
        complete: function (e) {
            console.log(e);
        }
    });
});