import mongoose, { Schema, Model, Document, CallbackWithoutResultAndOptionalError } from 'mongoose';

// TypeScript interface for Event document
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // ISO format date string
  time: string; // Normalized time string
  mode: string; // e.g., 'online', 'offline', 'hybrid'
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Event schema definition
const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Title cannot be empty',
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Description cannot be empty',
      },
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Overview cannot be empty',
      },
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Image cannot be empty',
      },
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Venue cannot be empty',
      },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Location cannot be empty',
      },
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Mode cannot be empty',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Audience cannot be empty',
      },
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (value: string[]) => Array.isArray(value) && value.length > 0,
        message: 'Agenda must be a non-empty array',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      validate: {
        validator: (value: string) => value.trim().length > 0,
        message: 'Organizer cannot be empty',
      },
    },
    tags: {
      type: [String],
      required: [true, 'Tags is required'],
      validate: {
        validator: (value: string[]) => Array.isArray(value) && value.length > 0,
        message: 'Tags must be a non-empty array',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Pre-save hook: Generate slug from title and normalize date/time
const preSaveHook = function (this: IEvent, next: CallbackWithoutResultAndOptionalError) {
  // Generate slug only if title is modified or document is new
  if (this.isModified('title') || this.isNew) {
    // Convert title to URL-friendly slug: lowercase, replace spaces/special chars with hyphens
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  // Normalize date to ISO format (YYYY-MM-DD)
  if (this.isModified('date') || this.isNew) {
    try {
      const dateObj = new Date(this.date);
      if (!isNaN(dateObj.getTime())) {
        // Convert to ISO date string (YYYY-MM-DD)
        this.date = dateObj.toISOString().split('T')[0];
      } else {
        // If already in YYYY-MM-DD format, validate it
        const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!isoDateRegex.test(this.date)) {
          return next(new Error('Invalid date format. Expected YYYY-MM-DD or a valid date string.'));
        }
      }
    } catch (error) {
      return next(new Error('Invalid date format. Expected YYYY-MM-DD or a valid date string.'));
    }
  }

  // Normalize time to consistent format (HH:MM AM/PM or HH:MM)
  if (this.isModified('time') || this.isNew) {
    const timeStr = this.time.trim();
    // If time is already in a consistent format, keep it; otherwise try to normalize
    // This preserves formats like "09:00 AM" or "14:30"
    if (timeStr.length > 0) {
      this.time = timeStr;
    } else {
      return next(new Error('Time cannot be empty'));
    }
  }

  next();
};

eventSchema.pre('save', preSaveHook as any);

// Create unique index on slug
eventSchema.index({ slug: 1 }, { unique: true });

// Create and export the Event model
const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>('Event', eventSchema);

export default Event;
