import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  // Updated icon structure with percentage-based sizing
  icon: {
    url: {
      type: String,
      required: true,
      trim: true
    },
    scaledSize: {
      width: {
        type: Number,
        default: 40
      },
      height: {
        type: Number,
        default: 40
      },
      // Add percentage options
      widthPercent: {
        type: Number,
        default: null
      },
      heightPercent: {
        type: Number,
        default: null
      },
      usePercentage: {
        type: Boolean,
        default: false
      }
    }
  },
  // Add image fields
  imageUrl: {
    type: String,
    default: null,
    trim: true
  },
  // Gallery images array
  gallery: [{
    url: {
      type: String,
      required: true,
      trim: true
    },
    caption: {
      type: String,
      trim: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to update the updatedAt timestamp
locationSchema.pre('save', function(next) {
  if (this.isModified()) {
    this.updatedAt = Date.now();
  }
  next();
});

// Add geographic indexing for efficient location-based queries
locationSchema.index({ 'position.lat': 1, 'position.lng': 1 });

const Location = mongoose.model('Location', locationSchema);

export default Location;