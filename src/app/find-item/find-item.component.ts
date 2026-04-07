import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, signal, ViewChild } from '@angular/core';

declare const SelfieSegmentation: any;

@Component({
  selector: 'app-find-item',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './find-item.component.css',
  templateUrl: './find-item.component.html',
})
export class FindItemComponent {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('outputCanvas') outputCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('captureCanvas') captureCanvas!: ElementRef<HTMLCanvasElement>;
  @Output() emitPhoto = new EventEmitter<File>();

  streaming = signal(false);
  blurAmount = signal(10);
  photoUrl = signal<string | null>(null);

  private stream: MediaStream | null = null;
  private segmentation: any = null;
  private animFrameId: number | null = null;

  constructor() {}

  async toggleCamera() {
    if (this.streaming()) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }
  }

  async startCamera() {
    // Dynamically load MediaPipe script if not already loaded
    await this.loadMediaPipe();

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = this.videoEl.nativeElement;
      video.srcObject = this.stream;
      await video.play();

      this.setupSegmentation();
      this.streaming.set(true);
    } catch (err) {
      alert('Could not access camera: ' + (err as Error).message);
    }
  }

  private loadMediaPipe(): Promise<void> {
    if (typeof SelfieSegmentation !== 'undefined') return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load MediaPipe'));
      document.head.appendChild(script);
    });
  }

  private setupSegmentation() {
    const video = this.videoEl.nativeElement;
    const canvas = this.outputCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;

    this.segmentation = new SelfieSegmentation({
      locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${f}`,
    });

    this.segmentation.setOptions({ modelSelection: 1 }); // 1 = landscape model

    this.segmentation.onResults((results: any) => {
      const { width, height } = results.image;
      canvas.width = width;
      canvas.height = height;

      // 1. Draw the blurred full frame as background
      ctx.filter = `blur(${this.blurAmount()}px)`;
      ctx.drawImage(results.image, 0, 0, width, height);
      ctx.filter = 'none';

      // 2. Use segmentation mask to cut out the person and draw them sharp
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.drawImage(results.segmentationMask, 0, 0, width, height);
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.drawImage(results.image, 0, 0, width, height); // sharp original behind person
      ctx.restore();
    });

    const sendFrame = async () => {
      if (!this.streaming()) return;
      await this.segmentation.send({ image: video });
      this.animFrameId = requestAnimationFrame(sendFrame);
    };
    sendFrame();
  }

  stopCamera() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.segmentation?.close();
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.segmentation = null;
    this.animFrameId = null;
    this.streaming.set(false);
  }

  base64ToFile(base64: string, mimeType = 'image/png') {
    const byteString = atob(base64.split(',')[1] ?? base64);
    const buffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      buffer[i] = byteString.charCodeAt(i);
    }
    return new File([buffer], 'photo.png', { type: mimeType });
  }

  takePhoto() {
    const src = this.outputCanvas.nativeElement;
    const canvas = this.captureCanvas.nativeElement;
    canvas.width = src.width;
    canvas.height = src.height;
    canvas.getContext('2d')!.drawImage(src, 0, 0);
    this.emitPhoto.emit(this.base64ToFile(canvas.toDataURL('image/png')));

    this.photoUrl.set(canvas.toDataURL('image/png'));
  }

  ngOnDestroy() {
    this.stopCamera();
  }
}
