const getExtension = (base64) => {

    //  ___________________________________________________________________________________________________________________
    // | TYPE    |           BASE64           |             BINARY                  |                HEX                   |
    // |-------------------------------------------------------------------------------------------------------------------|
    // |   png   |           iVBORw           |               PNG                   |             89 50 4E 47              |
    // |   jpeg  |            /9g=            |                ÿØ                   |                FF D8                 |
    // |   pdf   |           JVBERg           |               %PDF                  |            25 50 44 46               | 
    // |   tiff  |             SUk            |                II                   |                49 49                 | 
    // |   tiff  |             TU0            |                MM                   |                4D 4D                 |
    // |   docs  |         UEsDBBQABgA        |              PK♥♦¶♠                 |       50 4B 03 04 14 00 06 00        |        
    // |   gif   |          R0lGODlh          |              GIF89a                 |         47 49 46 38 39 61            |  
    // |   mp3   |            SUQz            |               ID3                   |               49 44 33               |    
    // |   wav   |    UklGRg + V0FWRWZtdA     |           RIFF + WAVEfmt            |  52 49 46 46 + 57 41 56 45 66 6d 74  |  
    // |   mov   |                            |     ftyp / ftypqt( qt sub-type )    |              66 74 79 70             | 
    // |   avi   |                            |          RIFF + AVI                 |  52 49 46 46 + 41 56 49 20           |
    // |   psd   |                            |                8BPS                 |              38 42 50 53             |
    // |   ai    |                            |                                     |                                      | 
    // |_________|____________________________|_____________________________________|______________________________________|
    // https://en.wikipedia.org/wiki/List_of_file_signatures


    let slice = base64.slice(0, 20)
    let dic = {
        "4949": { type: "tiff" },
        "4D4D": { type: "tiff" },
        "25504446": { type: "pdf" },
        "89504E47": { type: "png" },
        "FFD8": { type: "jpeg" },
        "504B030414000600": { type: "docs" },
        "47494638": { type: "gif" },
        "494433": { type: "mp3" },
        "52494646": {
            type: "conflict",
            extra: {
                "57415645666d74": { type: "wav" },
                "41564920": { type: "avi" },
            }
        },
        "66747970": {
            type: "conflict",
            extra: {
                "7174": { type: "mov" },
                "69736F6D": { type: "mp4" },
                "4D534E56": { type: "mp4" }
            }
        },
        "38425053": { type: "psd" }
    }

    const startBase = Buffer.from(slice, "base64").toString("hex")
    function includesLowerCase(string, key) {
        return string.toLowerCase().includes(key.toLowerCase())
    }

    for (const key in dic) {
        if (Object.hasOwnProperty.call(dic, key)) {
            const element = dic[key];
            if (element.type == 'conflict') {
                for (const keyExtra in element.extra) {
                    if (Object.hasOwnProperty.call(element.extra, keyExtra)) {
                        if (includesLowerCase(startBase, keyExtra)) {
                            return element.extra[keyExtra].type;
                        }
                    }
                }
                if (includesLowerCase(startBase, key)) {
                    return element.type
                }
            }
        }
    }
    return undefined
}
