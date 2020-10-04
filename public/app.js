const app = new Vue({
    el: '#app',
    data: {
        host: "http://localhost:3000",
        url: '',
        error: null,
        formVisible: true,
        created: null,
    },
    methods: {
        async createSmol() {
            this.error = '';
            const response = await fetch('/new', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    url: this.url,
                }),
            });
            if (response.ok) {
                const result = await response.json();
                this.formVisible = false;
                this.created = `${this.host}/${result.slug}`;
            } else if (response.status === 429) {
                this.error = 'You are sending too many requests. Try again in 30 seconds.';
            } else {
                const result = await response.json();
                this.error = result.message;
            }
        },
        reset() {
            this.formVisible = true
            this.created = null
            this.error = null
            this.url = ""
        }
    },
});