import { Schema, model, models } from 'mongoose';

const ProjectSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['store', 'product'], required: true },
  name: { type: String, required: true },
  inputs: { type: Schema.Types.Mixed, required: true },
  output: { type: Schema.Types.Mixed, required: true },
}, { timestamps: true });

const Project = models.Project || model('Project', ProjectSchema);

export default Project;
