<template>
    <div style="min-height: 100%;">
        <div class="convert-progress" v-if="loading">
            <v-progress-linear v-model="percentage" buffer-value="100" color="success lighten-2">
            </v-progress-linear>
        </div>
        <v-container>
            <v-row justify="center">
                <v-col cols="12" md="6">
                    <div>
                        <v-img class="mx-auto" :src="require('../assets/bulk-squarefit.svg')" width="150"></v-img>
                    </div>
                    <v-card class="my-3 rounded-xl">
                        <v-card-title class="justify-center">
                            Select Images
                        </v-card-title>
                        <v-card-text>
                            <div>
                                <v-file-input ref="images" color="primary accent-4" counter label="File input" multiple
                                    placeholder="Select your files" prepend-icon="mdi-paperclip" outlined rounded
                                    :show-size="1000" v-model="files" accept="image/*" class="file-input">
                                    <template v-slot:selection="{ index, text }">
                                        <v-chip v-if="index < 2" color="primary accent-4" dark label small>
                                            {{ text }}
                                        </v-chip>
                                        <span v-else-if="index === 2"
                                            class="text-overline grey--text text--darken-3 mx-2">
                                            +{{ files.length - 2 }} File(s)
                                        </span>
                                    </template>
                                </v-file-input>

                                <div class="mt-2">
                                    <p class="mb-2 title">Background</p>

                                    <v-radio-group v-model="background.option">
                                        <v-radio value="transparent">
                                            <template v-slot:label>
                                                <div>Transparent <span class="caption">Sets the background as
                                                        transparent.</span></div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="automatic">
                                            <template v-slot:label>
                                                <div>Automatic color <span class="caption">Sets background color
                                                        automatically.</span></div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="custom">
                                            <template v-slot:label>
                                                <div>
                                                    <p class="mb-2">Custom color</p>
                                                    <v-color-picker :disabled="background.option != 'custom'"
                                                        dot-size="25" hide-inputs hide-mode-switch mode="hexa"
                                                        swatches-max-height="200" v-model="background.selected">
                                                    </v-color-picker>
                                                </div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="blur">
                                            <template v-slot:label>
                                                <div>
                                                    Blurred <span class="caption">Source image blurred in
                                                        background.</span>
                                                    <div>
                                                        <v-slider label="Blur radius" max="50" min="1"
                                                            v-model="background.radius"
                                                            :disabled="background.option != 'blur'"
                                                            class="blur-range-slider">
                                                        </v-slider>
                                                    </div>
                                                </div>
                                            </template>
                                        </v-radio>
                                    </v-radio-group>

                                </div>
                            </div>
                            <!-- <template v-if="files.length > 0">
                                <div class="text-muted mb-2 title">Preview</div>
                                <v-row align="center">
                                    <v-col cols="3" class="border text-center p-0" v-for="(file, index) in files"
                                        :key="index">
                                        <img :src="file" alt="" style="height: 100px;object-fit: contain;">
                                    </v-col>
                                </v-row>
                            </template> -->
                            <div class="text-center">
                                <v-btn color="primary" :disabled="loading || files.length == 0" @click="onSubmit"
                                    rounded>Square Fit'em</v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                    <template v-if="completed.length > 0">
                        <p class="title mb-2">Completed</p>
                        <v-list class="rounded-xl" rounded>
                            <template v-for="(image, index) in completed">
                                <v-list-item :key="index" @click="previewImage(index)" class="rounded-xl my-1">
                                    <v-list-item-avatar rounded="0">
                                        <v-img :src="image.url"></v-img>
                                    </v-list-item-avatar>
                                    <v-spacer></v-spacer>
                                    <v-btn :color="image.downloaded ? 'success' : 'primary'" rounded
                                        @click.stop="downloadImage(index)">
                                        <v-icon dark left>
                                            {{ image.downloaded ? 'mdi-check' : 'mdi-download' }}
                                        </v-icon> {{ image.downloaded ? 'Downloaded' : 'Download' }}
                                    </v-btn>
                                </v-list-item>
                                <v-divider :inset="false" :key="index + 'divider'" v-if="index != completed.length - 1">
                                </v-divider>
                            </template>
                        </v-list>
                        <v-btn class="my-5 mx-auto" block large color="primary" @click="bulkDownload()" rounded>
                            <v-icon dark left>
                                mdi-download
                            </v-icon>Download all
                        </v-btn>
                        <v-btn block class="mx-auto mb-4" large color="primary" @click="bulkDownload(false)"
                            v-if="completed.some(i => i.downloaded) && !(completed.filter(i => i.downloaded).length == completed.length)"
                            rounded>
                            <v-icon dark left>
                                mdi-download
                            </v-icon>Download
                            remaining
                        </v-btn>
                    </template>
                    <ul class="list-group list-group-flush" v-if="errors">
                        <li class="list-group-item text-danger" v-for="(error, index) in errors" :key="index">{{ index +
                                1
                        }})
                            {{ error }}</li>
                    </ul>
                </v-col>

            </v-row>
        </v-container>

        <!-- Dialog -->
        <v-dialog v-model="preview" width="500">
            <v-sheet rounded class="pa-4 text-center" v-if="previewIndex != null"
                :set="image = completed[previewIndex]">
                <v-img :src="image.url" class="mb-3" alt="Square pic result">
                    <div class="image-controls"
                        :class="{ 'left-end': previewIndex == 0, 'right-end': previewIndex == completed.length - 1 }">
                        <div class="left" @click="previewIndex > 0 ? previewIndex-- : null">
                            <v-icon x-large>mdi-chevron-left</v-icon>
                        </div>
                        <div class="right" @click="previewIndex < completed.length - 1 ? previewIndex++ : null">
                            <v-icon x-large>mdi-chevron-right</v-icon>
                        </div>
                    </div>
                </v-img>
                <!-- <img :src="" alt="Square pic result" class="mb-3" /> -->
                <v-btn :color="image.downloaded ? 'success' : 'primary'" rounded @click="downloadImage(previewIndex)">
                    <v-icon dark left>
                        {{ image.downloaded ? 'mdi-check' : 'mdi-download' }}
                    </v-icon> {{ image.downloaded ? 'Downloaded' : 'Download' }}
                </v-btn>
            </v-sheet>
        </v-dialog>

        <!-- Snackbar -->
        <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color">
            {{ snackbar.msg }}</v-snackbar>
    </div>
</template>
<script>
export default {
    name: 'HomeView',
    data() {
        return {
            files: [],
            loading: false,
            errors: [],
            previewIndex: null,
            preview: false,
            background: {
                option: 'automatic',
                selected: '#FFFFFF',
                radius: 8
            },
            progress: {
                total: 0,
                loaded: 0
            },
            dim: 2048,
            ctx: null,
            completed: [],
            suffix: new Date().getTime().toString(32),
            snackbar: {
                show: false,
                timeout: 2000,
                color: 'success',
                msg: ''
            },
            count: 0,
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
                this.showSnackBar('Process complete.', 'success');
                setTimeout(() => {
                    this.loading = false;
                }, 1000);
                this.files = [];
                window.localStorage.setItem('converted-count', this.count);
            }
        },
        'background.option': function (value) {
            window.localStorage.setItem('selected-option', value);
        }
    },
    methods: {
        showSnackBar(msg, color = 'success') {
            const snackbar = this.snackbar;
            snackbar.msg = msg;
            snackbar.color = color;
            snackbar.show = true;
        },
        addToCompleted(url, filename) {
            this.completed.push({ url, downloaded: false, filename })
        },
        previewImage(index) {
            this.previewIndex = index;
            this.preview = true;
        },
        downloadImage(index) {
            const image = this.completed[index];
            var a = document.createElement('a');
            a.href = image.url;
            a.download = image.filename;
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
                const option = this.background.option;
                image.onload = () => {
                    let color = this.background.selected;
                    const imgHeight = image.height, imgWidth = image.width;
                    this.ctx.clearRect(0, 0, this.dim, this.dim);
                    this.ctx.beginPath();
                    this.ctx.rect(0, 0, this.dim, this.dim);
                    if (['automatic', 'blur'].includes(option)) {
                        color = this.getAutomaticColor(image);
                    }
                    if (['automatic', 'custom', 'blur'].includes(option)) {
                        this.ctx.fillStyle = color;
                        this.ctx.fill();
                    }
                    if (option === 'blur') {
                        this.ctx.filter = `blur(${this.background.radius}px)`;
                        let bgImgWidth, bgImgHeight;
                        if (imgWidth > imgHeight) {
                            bgImgWidth = imgWidth * (this.dim / imgHeight);
                            bgImgHeight = this.dim;
                            this.ctx.drawImage(image, ((this.dim - bgImgWidth) / 2), 0, bgImgWidth, bgImgHeight);
                        } else {
                            bgImgHeight = imgHeight * (this.dim / imgWidth);
                            bgImgWidth = this.dim;
                            this.ctx.drawImage(image, 0, ((this.dim - bgImgHeight) / 2), bgImgWidth, bgImgHeight);
                        }
                        this.ctx.filter = `blur(0px)`;
                    }
                    let x = 0, y = 0;
                    let fgImgWidth, fgImgHeight;
                    if (imgHeight > imgWidth) {
                        fgImgWidth = imgWidth / (imgHeight / this.dim)
                        fgImgHeight = this.dim;
                        x = (this.dim - fgImgWidth) / 2;
                        y = 0;
                    }
                    else {
                        fgImgHeight = imgHeight / (imgWidth / this.dim)
                        fgImgWidth = this.dim;
                        x = 0;
                        y = (this.dim - fgImgHeight) / 2;
                    }
                    this.ctx.drawImage(image, x, y, fgImgWidth, fgImgHeight);
                    // this.outputUrl = this.ctx.canvas.toDataURL("image/jpg");
                    this.progress.loaded++;
                    this.count++;
                    const extension = option == 'transparent' ? 'png' : 'jpeg';
                    const imgId = `${this.count}`.padStart(4, '0');
                    this.addToCompleted(this.ctx.canvas.toDataURL(`image/${extension}`), `Bulk-Squarefit ${new Date().toISOString().slice(0, 10)}-IMG${imgId}.${extension}`);
                }
            }, false);
            reader.readAsDataURL(file);
        },
        onSubmit() {
            if (!this.files.length) {
                this.showSnackBar('Add images', 'red');
                return;
            }
            this.loading = true;
            this.progress.loaded = 0;
            this.progress.total = this.files.length;
            // const color = this.background.option == 'custom' ? this.background.selected.replace('#', "") : this.background.option;

            // if (['custom', 'automatic'].includes(this.background.option)) {
            for (let image of this.files) {
                this.handleOffline(image)
            }
            // } else {
            //     for (let image of this.$refs.images.files) {
            //         const params = new URLSearchParams()
            //         params.append('color', color)
            //         if (color == 'blur')
            //             params.append('radius', this.background.radius)
            //         this.handleOnline(image, params)
            //     }
            // }
        }
    },
    mounted() {
        const canvas = document.createElement('canvas');
        canvas.height = this.dim;
        canvas.width = this.dim;
        this.ctx = canvas.getContext('2d');
    },
    created() {
        this.count = Number(window.localStorage.getItem('converted-count') ?? 0);
        const option = window.localStorage.getItem('selected-option') ?? 'automatic';
        if (['automatic', 'custom', 'blur', 'transparent'].includes(option))
            this.background.option = option;
    }

}
</script>
<style lang="scss">
.convert-progress {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100vw;
}

.v-radio {
    align-items: flex-start;
}

.file-input .v-input__append-inner {
    align-self: center;
    margin-top: 0;
}

.blur-range-slider label {
    flex: unset !important;
}

.image-controls {
    height: 100%;
    display: flex;
    justify-content: space-between;
    opacity: 0;
    transition: all 0.2s linear;

    &:hover {
        opacity: 1;
    }

    .left,
    .right {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s linear;
        background-color: rgba(0, 0, 0);
        opacity: 0.1;
        width: 20%;

        &:hover {
            opacity: 0.2;
            background-color: rgba(0, 0, 0);
        }
    }

    &.left-end .left {
        opacity: 0;
    }

    &.right-end .right {
        opacity: 0;
    }
}
</style>