const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, 'public', 'projects', 'ranaan-ccc');
const OUTPUT_FILE = path.join(__dirname, 'src', 'components', 'ranaan-ccc-editorial-data.json');

const EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

function generate() {
    if (!fs.existsSync(IMAGE_DIR)) {
        console.error(`Directory not found: ${IMAGE_DIR}`);
        return;
    }

    const files = fs.readdirSync(IMAGE_DIR)
        .filter(f => EXTS.includes(path.extname(f).toLowerCase()))
        .sort();

    const spreads = [];
    
    // Group files into spreads (2 images per spread, or 1 image + 1 text)
    // For this generator, we'll create one spread per image for maximum flexibility
    files.forEach((file, idx) => {
        const name = path.basename(file, path.extname(file))
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        spreads.push({
            id: `spread-${idx + 1}`,
            thumbLabel: name,
            left: {
                theme: idx % 2 === 0 ? "dark" : "light",
                kicker: `Spread ${idx + 1}`,
                title: name,
                body: "New content archive in motion.",
                footer: `Page ${(idx * 2) + 1}`
            },
            right: {
                media: `/projects/ranaan-ccc/${file}`,
                mediaLabel: name,
                footer: `Page ${(idx * 2) + 2}`
            }
        });
    });

    const data = {
        project: {
            title: "RANAAN × CCC — Future Archives",
            subtitle: "Controlled Chaos Collection SS25",
            brand: "RANAAN × CCC",
            viewer_mode: "editorial_spread",
            theme: "brutalist_analog_cinematic"
        },
        spreads: spreads
    };

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
    console.log(`Successfully generated ${spreads.length} spreads in ${OUTPUT_FILE}`);
}

generate();
