<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragover = false"
        @dragover.prevent.stop="is_dragover = true"
        @dragenter.prevent.stop="is_dragover = true"
        @dragleave.prevent.stop="is_dragover = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="upload.text_class">
          <i :class="upload.icon"></i>{{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            class="transition-all progress-bar"
            :class="upload.variant"
            :style="{ width: upload.current_progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase';
export default {
  name: 'upload',
  data() {
    return {
      is_dragover: false,
      uploads: []
    };
  },
  props: ['addSong'],
  methods: {
    // file upload method
    upload($event) {
      this.is_dragover = false;

      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files];

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return;
        }

        if (!navigator.onLine) {
          this.upload.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'text-red-400'
          });
          return;
        }
        const storageRef = storage.ref(); // music-ed0d8.appspot.com
        const songsRef = storageRef.child(`songs/${file.name}`); // music-ed0d8.appspot.com/songs/simple.mp3
        const task = songsRef.put(file);

        const uploadIndex =
          this.uploads.push({
            task,
            current_progress: 0,
            name: file.name,
            variant: 'bg-blue-400',
            icon: 'fas fa-spinner fa-spin',
            text_class: ''
          }) - 1;
        // progress bar dynamic
        task.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].current_progress = progress;
          },
          // uplaod error condition
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].text_class = 'text-red-400';
            console.log(error);
          },
          // upload success condition
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0
            };

            try {
              // Retrieve the download URL asynchronously
              song.url = await task.snapshot.ref.getDownloadURL();

              // Add song data to Firebase database
              const songRef = await songsCollection.add(song);

              // Update the UI or perform additional actions
              const songSnapshot = await songRef.get();
              this.addSong(songSnapshot);

              // Update progress bar for successful upload
              this.uploads[uploadIndex].variant = 'bg-green-400';
              this.uploads[uploadIndex].icon = 'fas fa-check';
              this.uploads[uploadIndex].text_class = 'text-green-400';
            } catch (error) {
              // Handle any errors that occur during the process
              this.uploads[uploadIndex].variant = 'bg-red-400';
              this.uploads[uploadIndex].icon = 'fas fa-times';
              this.uploads[uploadIndex].text_class = 'text-red-400';
              console.error('Error retrieving download URL:', error);
            }

            // song.url = await task.snapshot.ref.getDownloadURL();
            // const songRef = await songsCollection.add(song); // add song data to firebase database

            // const songSnapshot = await songRef.get();

            // this.addSong(songSnapshot);

            // // upload success progress bar
            // this.uploads[uploadIndex].variant = 'bg-green-400';
            // this.uploads[uploadIndex].icon = 'fas fa-check';
            // this.uploads[uploadIndex].text_class = 'text-green-400';
          }
        );
      });
      console.log(files);
    }
    // upload cancel
    // cancelUploads() {
    //   this.uploads.forEach((uplaod) => {
    //     uplaod.task.cancel();
    //   });
    // }
  },
  beforeUnmount() {
    this.uploads.forEach((uplaod) => {
      uplaod.task.cancel();
    });
  }
};
</script>