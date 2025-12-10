const mongoose = require('mongoose');

const AddClassSchema = new mongoose.Schema({
    course: { type: String, required: true },
    batch_name: { type: String },
    batchStartDate: { type: String },
    batchEndDate: { type: String },
    classTime: { type: String },
    batchDescription: { type: String },
    whatsappLink: { type: String },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save hook to auto-generate batch_name
AddClassSchema.pre("save", async function (next) {
    if (!this.batch_name) {
        // Count existing batches for this course
        const count = await mongoose.model("AddClass").countDocuments({ course: this.course });

        // Generate batch name
        const batchNumber = (count + 1).toString().padStart(2, "0"); // 01, 02, 03
        this.batch_name = `${this.course} Batch ${batchNumber}`;
    }
    next();
});

const AddClass = mongoose.model("AddClass", AddClassSchema);

module.exports = AddClass;
