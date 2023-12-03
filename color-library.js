// This function takes the "backgroundcolor" and messes with the alpha.
export const changeAlpha = (rgbaString, newAlpha) => {
    //Match one or more digits "\d+", then an optional "?" decimal "\.\d+"
    if(rgbaString == undefined)
        return;
    
    const match = rgbaString.match(/(\d+(\.\d+)?)/g);
    if(!match || match.length !== 4)
        return rgbaString;

    // eslint-disable-next-line
    const [red, green, blue, _] = match;
    const returnRGBA = `rgba(${red},${green},${blue},${newAlpha})`;

    return returnRGBA;
};

export const contrastText = (rgbaString) => {
    if(rgbaString == undefined)
        return;

    const match = rgbaString.match(/(\d+(\.\d+)?)/g);
    if(!match || match.length !== 4)
        return rgbaString;

    if(Math.max(...match) > 130)
        return 'rgba(0,0,0,1)';
    else
        return 'rgba(255,255,255,1)';
};