// app.component.ts
import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-find-item',
  standalone: true,
  imports: [CommonModule, MatButton],
  templateUrl: `find-item.component.html`,
  styleUrl: `find-item.component.css`,
})
export class FindItemComponent {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;
  readonly destroyRef = inject(DestroyRef);

  @Output() emitPhoto = new EventEmitter<File>();

  readonly streaming = signal(false);
  private stream: MediaStream | null = null;

  async toggleCamera() {
    if (this.streaming()) {
      this.stopCamera();
    } else {
      await this.startCamera();
    }

    timer(1000, 1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.streaming()) this.takePhoto();
      });
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoEl.nativeElement.srcObject = this.stream;
      this.streaming.set(true);
    } catch (err) {
      alert('Could not access camera: ' + (err as Error).message);
    }
  }

  stopCamera() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    this.videoEl.nativeElement.srcObject = null;
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
    const video = this.videoEl.nativeElement;
    const canvas = this.canvasEl.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')!.drawImage(video, 0, 0);

    this.emitPhoto.emit(this.base64ToFile(canvas.toDataURL('image/png')));
  }
}
