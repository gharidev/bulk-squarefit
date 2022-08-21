<template>
    <BaseLayout>
        <div class="row justify-content-center">
            <div class="col-12 col-md-6">
                <h3 class="text-center">Bulk SquareFit</h3>
                <div class="card my-3">
                    <div class="card-header">
                        <h5 class="card-title m-0">Select Images</h5>
                    </div>
                    <div class="card-body">
                        <div>
                            <input ref="images" class="form-control" type="file" id="images-input" accept="image/*"
                                @change="onChange" multiple>
                            <div class="mt-2">
                                <p class="mb-2"><strong>Background</strong></p>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="background_opt"
                                        id="background-opt-2" v-model="background.option" value="automatic">
                                    <label class="form-check-label" for="background-opt-2">
                                        Automatic color <br><span class="text-muted small">Sets background color
                                            automatically</span>
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="background_opt"
                                        id="background-opt-1" v-model="background.option" value="custom">
                                    <label class="form-check-label" for="background-opt-1">
                                        Custom color
                                        <div class="mt-2 d-flex align-items-center">
                                            <input type="color" id="background-color" v-model="background.selected"
                                                :disabled="background.option != 'custom'">
                                        </div>
                                    </label>
                                </div>
                                <!-- <div class="form-check">
                                <input class="form-check-input" type="radio" name="background_opt" id="background-opt-2"
                                    v-model="background.option" value="dominant">
                                <label class="form-check-label" for="background-opt-2">
                                    Dominant color <br><span class="text-muted small">Dominant color from the
                                        image</span>
                                </label>
                            </div> -->
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="background_opt"
                                        id="background-opt-3" v-model="background.option" value="blur">
                                    <label class="form-check-label" for="background-opt-3">
                                        Blurred <br><span class="text-muted small">Source image blurred in
                                            background</span>
                                        <div>
                                            <label for="blur-radius" class="form-label">Blur radius</label>
                                            <input type="range" class="form-range" id="blur-radius" min="1" max="50"
                                                v-model="background.radius" :disabled="background.option != 'blur'">
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <template v-if="fileList.length > 0">
                            <hr>
                            <div class="text-muted mb-2">Preview</div>
                            <div class="row align-items-center">
                                <div class="col-3 border text-center p-0" v-for="(file, index) in fileList"
                                    :key="index">
                                    <img :src="file" alt="" class="img-fluid"
                                        style="height: 100px;object-fit: contain;">
                                </div>
                            </div>
                        </template>
                    </div>
                    <div class="card-footer">
                        <button class="btn btn-primary" :disabled="loading" @click="onSubmit" v-if="!loading">Square
                            Fit'em</button>
                        <div class="progress" v-else>
                            <div class="progress-bar" :class="{ 'bg-success': percentage == 100 }" role="progressbar"
                                :style="{ 'width': percentage + '%' }" :aria-valuenow="percentage" aria-valuemin="0"
                                aria-valuemax="100"></div>
                        </div>
                    </div>
                </div>
                <template v-if="completed.length > 0">
                    <h5>Completed</h5>
                    <ul class="list-group mb-3">
                        <li class="list-group-item d-flex justify-content-between align-items-center"
                            v-for="(image, index) in completed" :key="index">
                            <img :src="image.url" alt="" style="height: 50px;width: 50px;object-fit: cover;"
                                class="border">
                            <button class="btn btn-link" @click="previewImage(index)">Preview</button>
                            <button class="btn btn-sm btn-outline-success" @click="downloadImage(index)">Download
                                {{ image.downloaded ? 'again' : '' }}</button>
                        </li>
                    </ul>
                    <button class="btn btn-primary d-block mx-auto mb-2" @click="bulkDownload()">Download all</button>
                    <button class="btn btn-outline-primary d-block mx-auto" @click="bulkDownload(false)"
                        v-if="completed.some(i => i.downloaded) && !(completed.filter(i => i.downloaded).length == completed.length)">Download
                        remaining</button>
                </template>
                <ul class="list-group list-group-flush" v-if="errors">
                    <li class="list-group-item text-danger" v-for="(error, index) in errors" :key="index">{{ index + 1
                    }})
                        {{ error }}</li>
                </ul>
            </div>


            <!-- Modal -->
            <div class="modal fade" id="imagePreviewModal" tabindex="-1" aria-labelledby="imagePreviewModalLabel"
                aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content" v-if="previewIndex != null">
                        <div class="modal-header">
                            <h5 class="modal-title" id="imagePreviewModalLabel">Image Preview</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <img :src="completed[previewIndex].url" alt="" class="img-fluid border">
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn btn-primary" @click="downloadImage(previewIndex)">Download
                                {{ completed[previewIndex].downloaded ? 'again' : '' }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </BaseLayout>
</template>
<script>
import BaseLayout from '@/components/BaseLayout.vue';
export default {
    name: 'HomeView',
    components: {
        BaseLayout
    },
    data() {
        return {
            loading: false,
            errors: [],
            fileList: [],
            previewIndex: null,
            background: {
                option: 'automatic',
                selected: '#ffffff',
                radius: 8
            },
            progress: {
                total: 0,
                loaded: 0
            },
            dim: 2048,
            ctx: null,
            completed: [],
            suffix: new Date().getTime().toString(32)
        }
    },
    computed: {
        percentage() {
            return this.progress.loaded * 100 / (this.progress.total || 1);
        }
    },
    watch: {
        // eslint-disable-next-line
        'progress.loaded': function (loaded, _) {
            if (loaded == this.progress.total) {
                setTimeout(() => {
                    this.loading = false;
                    this.removeSelectedFiles();
                }, 1000);
            }
        }
    },
    methods: {
        onChange(e) {
            this.fileList = [];
            for (let img of e.target.files) {
                this.fileList.push(URL.createObjectURL(img));
            }
        },
        removeSelectedFiles() {
            const el = this.$refs.images;
            el.value = null;
            this.onChange({ target: el });
        },
        addToCompleted(url) {
            this.completed.push({ url, downloaded: false })
        },
        previewImage(index) {
            this.previewIndex = index;
            new window.bootstrap.Modal(document.getElementById('imagePreviewModal')).show()
        },
        downloadImage(index) {
            const image = this.completed[index];
            var a = document.createElement('a');
            a.href = image.url;
            a.download = `SquareFit ${this.suffix} ${index + 1}.jpeg`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            image.downloaded = true;
        },
        bulkDownload(all = true) {
            this.completed.forEach((img, index) => {
                if (all || !img.downloaded)
                    this.downloadImage(index);
            });
        },
        componentToHex(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },
        rgbToHex(r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },
        getAutomaticColor(image) {
            const canvas = document.createElement('canvas');
            canvas.height = image.height;
            canvas.width = image.width;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            const cumPixelData = {};
            if (image.height > image.width) {
                const pixelData = new Uint8ClampedArray([...ctx.getImageData(0, 0, 1, image.height).data, ...ctx.getImageData(image.width - 1, 0, 1, image.height).data])
                for (let i = 0; i < image.height * 4 * 2; i = i + 4) {
                    const hex = this.rgbToHex(pixelData[i], pixelData[i + 1], pixelData[i + 2]);
                    cumPixelData[hex] = (cumPixelData[hex] ?? 0) + 1;
                }
            } else {
                const pixelData = new Uint8ClampedArray([...ctx.getImageData(0, 0, image.width, 1).data, ...ctx.getImageData(0, image.height - 1, image.width, 1).data])
                for (let i = 0; i < image.width * 4 * 2; i = i + 4) {
                    const hex = this.rgbToHex(pixelData[i], pixelData[i + 1], pixelData[i + 2]);
                    cumPixelData[hex] = (cumPixelData[hex] ?? 0) + 1;
                }
            }
            let occurance = -1, pickedColor;
            console.log(cumPixelData);
            for (let [key, value] of Object.entries(cumPixelData)) {
                if (value > occurance) {
                    pickedColor = key;
                    occurance = value;
                }
            }
            return pickedColor;
        },
        handleOnline(image, params) {
            let data = new FormData();
            data.append('image', image);
            fetch(`?${params.toString()}`, {
                method: 'POST',
                body: data,
            })
                .then(response => {
                    if (response.ok)
                        return response.blob();
                    else
                        throw new Error(response.statusText)
                })
                .then(blob => {
                    var url = window.URL.createObjectURL(blob);
                    this.addToCompleted(url);
                })
                .catch(err => {
                    this.errors.push(err.message);
                })
                .then(() => {
                    this.progress.loaded++;
                });
        },
        handleOffline(file) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                const image = new Image();
                image.src = reader.result;
                image.onload = () => {
                    let color = this.background.selected;
                    if (this.background.option == 'automatic') {
                        color = this.getAutomaticColor(image);
                    }
                    let x = 0, y = 0;
                    if (image.height > image.width) {
                        image.width = image.width / (image.height / this.dim)
                        image.height = this.dim;
                        x = (this.dim - image.width) / 2;
                        y = 0;
                    }
                    else {
                        image.height = image.height / (image.width / this.dim)
                        image.width = this.dim;
                        x = 0;
                        y = (this.dim - image.height) / 2;
                    }
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.dim, this.dim);
                    this.ctx.fillStyle = color;
                    this.ctx.fill();
                    this.ctx.drawImage(image, x, y, image.width, image.height);
                    // this.outputUrl = this.ctx.canvas.toDataURL("image/jpg");
                    this.progress.loaded++;
                    this.addToCompleted(this.ctx.canvas.toDataURL("image/jpeg"));
                }
            }, false);
            reader.readAsDataURL(file);
        },
        onSubmit() {
            if (!this.$refs.images?.files?.length) {
                alert("Add images!");
                return;
            }
            this.loading = true;
            this.progress.loaded = 0;
            this.progress.total = this.$refs.images.files.length;
            const color = this.background.option == 'custom' ? this.background.selected.replace('#', "") : this.background.option;

            if (['custom', 'automatic'].includes(this.background.option)) {
                for (let image of this.$refs.images.files) {
                    this.handleOffline(image)
                }
            } else {
                for (let image of this.$refs.images.files) {
                    const params = new URLSearchParams()
                    params.append('color', color)
                    if (color == 'blur')
                        params.append('radius', this.background.radius)
                    this.handleOnline(image, params)
                }
            }
        }
    },
    mounted() {
        const canvas = document.createElement('canvas');
        canvas.height = this.dim;
        canvas.width = this.dim;
        this.ctx = canvas.getContext('2d');
    }

}
</script>
<style>
</style>