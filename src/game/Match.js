import { promises as fs } from 'fs'
import path from 'path'

// using process.cwd() to get the path
// fs.readdir to get all files in directory
const GalleryPage = async () => {
    const currentDir = path.join(process.cwd(), 'src/assets/piezas/azul');
    const currentNames = await fs.readdir(imageDirectory)
    console.log(imageFilenames)
}

GalleryPage()