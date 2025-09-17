import { defineStore } from "pinia";

export const usePhotosStore = defineStore('movieStore', {
    state: () => ({
            photos: [],
            photosOut:[],
            loading: true,
            url:'https://jsonplaceholder.typicode.com/photos',
            currentPage: 0,
            isError:false
    }),
    getters: {},
    actions:{
        setPhotos(data){
            this.photos = data
            this.currentPage = 0
            this.photosOut = []
            this.fetchPhotos()
        },
        sortPhotos(field, direction){
            const photos = [...this.photos].sort((a, b) => {
                const valueA = a[field];
                const valueB = b[field];    
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                return direction === 'asc' 
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
                }

                return direction === 'asc' 
                ? valueA - valueB
                : valueB - valueA;
            });
            this.setPhotos(photos)
        },
        fetchPhotos(){
            if ((this.currentPage*30)<this.photos.length){
                const newItems = this.photos.slice(this.app.itemsPerPage*(this.currentPage),this.app.itemsPerPage*(this.currentPage+1) )
                this.currentPage +=1
                this.photosOut.push(...newItems)
            } 
        },
        async searchPhotos(albums){
            this.loading = true
            this.isError = false
            try {
            fetch(`${this.url}${albums}`, {
                headers: {
                "Content-Type": "application/json",
            },
            mode: "cors"
            })
            .then((response) => response.json())
            .then((json) => {
                this.setPhotos(json)
                this.loading = false
                return true
            }
            )}
            catch(error) {
                this.loading = false
                this.isError = true
            };
        }
    }
})