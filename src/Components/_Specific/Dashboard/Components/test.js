import React, { useRef } from "react";
// import useDrag and useDrop hooks from react-dnd
import { useDrag, useDrop } from "react-dnd";
import styles from "../dashboard.module.scss";


const type = "Image ";

const Image  = ({ image , index, moveImage}) => {



  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: type,
    hover(item) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // console.log(item)
      if (dragIndex === hoverIndex) {
        return;
      }
      moveImage(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type, id: image.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  // console.log(show)
  return (
    <div
      ref={ref}
      style={{ opacity: isDragging && image.id!=='Map' ? 0 : 1, width: image.id === 'Map'? '100%' : '25%' }}
      className={image.className}
    >
      {image.src}
    </div>
  );
};

const ImageList = ({ images, moveImage }) => {
  // render each image by calling Image component
  const renderImage = (image, index) => {
    // console.log(show, index)
    return <Image  image={image} key={`${image.id}-image`} moveImage={moveImage} index={index} />;
  };

  // Return the list of files
  return <section className={styles.CardList}>{images.map(renderImage)}</section>;
};

export default ImageList;
