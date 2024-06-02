---
title: Immersivaudio
description: AI Music generation from video and photos content.
date: "06-02-2024-16:00"
categories: 
    - Python
    - PyTorch
    - Gradio
    - AI
published: true
---

## Project Overview
Immersivaudio is an innovative project that transforms visual content into music using the power of artificial intelligence. By extracting and analyzing frames from videos, the project uses advanced AI techniques to generate descriptive prompts that are then converted into music. This seamless blend of computer vision, natural language processing, and music generation creates a unique and immersive audio-visual experience.

![Immersivaudio](https://i.imgur.com/A3AmTK6.png)

## Technologies Used
### Python
The core programming language used to develop the various scripts and algorithms for the project.

### PyTorch
Utilized for building and training the AI models, especially for object detection and music generation.

### Gradio
Provides an easy-to-use interface for running the project and interacting with the AI models.

## Key Features and Scripts

### Music Generation
- **audioldm2.py**: This script takes descriptive prompts and generates corresponding music, creating a soundtrack that reflects the visual content.

### Frame Analysis
- **best_frame_selection.py**: Implements a k-medoids clustering algorithm to select the most representative frames from a video, ensuring the highest quality input for further analysis.
- **frame_extractor.py**: Extracts frames from video files using a specific formula, preparing them for object detection and description generation.

### Object Detection and Description
- **yolov9.py**: Uses the YOLOv9 model to detect objects within video frames, providing detailed information about the content of each frame.
- **moondream2.py**: Generates textual descriptions from specific frames, translating visual information into a format suitable for music generation.

![YoloV9](https://i.imgur.com/3Shji5F.png)

### Integration and Interface
- **gradio_interface.py**: Creates a user-friendly Gradio interface, allowing users to easily run the project and interact with the AI components.
- **prompt_combiner.py**: Combines the outputs from the frame description and object detection scripts to generate comprehensive prompts for the music generation process.
- **video_reconstructor.py**: Reintegrates the generated music with the original video, producing a final product that harmonizes audio and visual elements.
- **main.py**: Oversees the entire workflow, ensuring smooth operation from video input to music output.

![Interface](https://i.imgur.com/is1SWhV.png)

## Notebooks
Several Jupyter notebooks (.ipynb files) accompany the project, illustrating the use of scripts and the overall video processing workflow. While these notebooks have been removed in the latest commit, they remain accessible in earlier versions of the repository.

## Usage Instructions
### Google Colab
For users without a GPU, Google Colab offers a convenient platform to run the project. The `Immersiveaudio_Colab.ipynb` notebook provides a detailed guide for executing the project in the cloud, leveraging Colab’s resources for AI processing.

### Local Machine
Users with a high-performance GPU and CUDA capabilities can run the project locally. After installing the necessary dependencies, the `gradio_interface.py` script can be executed to launch the Gradio interface and start the music generation process.

To explore the full project and access the code, visit the [GitHub repository](https://github.com/danieleavolio/Immersivaudio).


<h3 align="center">Video Example</h3>

<video style="margin:auto" width="320" height="240" controls>
  <source src="https://i.imgur.com/3kZ3CVA.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

## Conclusion

That's it. I worked on this project with 2 more people:
- [Daniele Avolio](https://github.com/danieleavolio)
- [Michele Vitale](https://github.com/maikuvit)
- [Teodor Chakarov](https://github.com/pythonTedo)

It was a very interesting project and we learned a lot about AI, music generation, and computer vision. See you in the next project! 🚀

---
