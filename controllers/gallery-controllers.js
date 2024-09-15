import Gallery from "../model/gallery-schema.js";

// export const addImageGallery = async (request, response) => {
//   console.log("bodyyyy", request.body);

//   try {
//     const { imageUrl, description, studentId } = request.body;
//     // console.log(admin);
//     const newGallery = new Gallery({
//       desc: description,
//       imageUrl: imageUrl,
//       uploadedByStudent: studentId,
//     });
//     await newGallery.save();
//     response.status(200).json({ data: "Inserted Sucessfully" });
//   } catch (error) {
//     console.log("error while saving image", error);
//     response.status(500).json({ message: error.message });
//   }
// };

export const addImageGallery = async (request, response) => {
  console.log("bodyyyy", request.body);

  try {
    const {
      imageUrl,
      description,
      studentId,
      taggedStudents,
      uploadedByTeacher,
    } = request.body;

    const newGallery = new Gallery({
      desc: description,
      imageUrl: imageUrl,
      uploadedByStudent: studentId,
      taggedStudents: taggedStudents,
      uploadedByTeacher: uploadedByTeacher,
    });

    await newGallery.save();
    response.status(200).json({ data: "Inserted Successfully" });
  } catch (error) {
    console.log("error while saving image", error);
    response.status(500).json({ message: error.message });
  }
};

export const allImages = async (req, res) => {
  try {
    const GalleryData = await Gallery.find({})
      .populate("uploadedByStudent", "name")
      .populate("uploadedByTeacher", "name")
      .populate("taggedStudents", "name");

    console.log("galleryyyyyyyy", GalleryData);
    res.status(200).json({ data: GalleryData });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const approveImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const updatedImage = await Gallery.findByIdAndUpdate(
      imageId,
      { isApproved: true },
      { new: true }
    );

    if (!updatedImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    res
      .status(200)
      .json({ message: "Image approved successfully", data: updatedImage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApprovedImages = async (req, res) => {
  try {
    const approvedImages = await Gallery.find({ isApproved: true });
    res.status(200).json({ data: approvedImages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
