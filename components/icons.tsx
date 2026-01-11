
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Upload, 
  Camera, 
  X, 
  ExternalLink,
  Loader2,
  Key,
  ArrowRight,
  ChevronDown,
  Film,
  Layout,
  Plus,
  Layers,
  Images,
  SlidersHorizontal,
  Sparkles,
  Type,
  Tv,
  RotateCw
} from 'lucide-react';

const defaultProps = {
  strokeWidth: 2,
};

export const ShoppingBagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <ShoppingBag {...defaultProps} {...props} />
);

export const MapPinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <MapPin {...defaultProps} {...props} />
);

export const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Search {...defaultProps} {...props} />
);

export const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Upload {...defaultProps} {...props} />
);

export const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Camera {...defaultProps} {...props} />
);

export const XIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <X {...defaultProps} {...props} />
);

export const ExternalLinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <ExternalLink {...defaultProps} {...props} />
);

export const Loader2Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Loader2 {...defaultProps} {...props} className={`animate-spin ${props.className || ''}`} />
);

export const KeyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Key {...defaultProps} {...props} />
);

export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <ArrowRight {...defaultProps} {...props} />
);

export const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <ChevronDown {...defaultProps} {...props} />
);

export const FilmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Film {...defaultProps} {...props} />
);

export const FramesModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Layout {...defaultProps} {...props} />
);

export const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Plus {...defaultProps} {...props} />
);

export const RectangleStackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Layers {...defaultProps} {...props} />
);

export const ReferencesModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Images {...defaultProps} {...props} />
);

export const SlidersHorizontalIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <SlidersHorizontal {...defaultProps} {...props} />
);

export const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Sparkles {...defaultProps} {...props} />
);

export const TextModeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Type {...defaultProps} {...props} />
);

export const TvIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Tv {...defaultProps} {...props} />
);

export const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <X {...defaultProps} {...props} />
);

export const ArrowPathIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <RotateCw {...defaultProps} {...props} />
);
