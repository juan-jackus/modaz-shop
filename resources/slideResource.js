//
function slideResourceArray(slides) {
  const data = [];
  slides.forEach((slide) => {
    data.push({
      id: slide._id,
      img: slide.image,
      title: slide.title,
      text1: slide.text1,
      text2: slide.text2,
      text3: slide.text3,
      position: slide.position,
      textColor: slide.textColor,
      category: slide.category,
      link: slide.link,
      linkText: slide.linkText,
      status: slide.status,
      order: slide.order,
      created_at: slide.createdAt,
      updated_at: slide.updatedAt,
    });
  });

  return data;
}

function slideResource(slide) {
  return {
    id: slide._id,
    img: slide.image,
    title: slide.title,
    text1: slide.text1,
    text2: slide.text2,
    text3: slide.text3,
    position: slide.position,
    textColor: slide.textColor,
    category: slide.category,
    link: slide.link,
    linkText: slide.linkText,
    status: slide.status,
    order: slide.order,
    created_at: slide.createdAt,
    updated_at: slide.updatedAt,
  };
}

module.exports = { slideResourceArray, slideResource };
