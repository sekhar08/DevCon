import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import Event from './event.model';

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking schema definition
const bookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Index for faster queries
    },
    userId: {
      type: String,
      ref: 'user',
      required: [true, 'User ID is required'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          // Email validation regex
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: 'Please provide a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Pre-save hook: Verify that the referenced event exists
bookingSchema.pre('save', async function (this: IBooking) {
  // Check if eventId references an existing Event
  const event = await Event.findById(this.eventId);
  if (!event) {
    throw new Error(`Event with ID ${this.eventId} does not exist`);
  }
});

// Create compound unique index to ensure a user can only register once per event
bookingSchema.index({ eventId: 1, userId: 1 }, { unique: true });

// Create and export the Booking model
const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
