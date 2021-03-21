import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Property } from '../property';

export interface ImageCroppedPropertyEvent extends ImageCroppedEvent {
  target?: HTMLInputElement;
  property?: Property;
}
