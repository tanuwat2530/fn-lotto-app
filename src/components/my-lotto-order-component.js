import React from 'react';
import '../styles/my-lotto-order-component.css';

const MyLottoOrder = ({ image, title, description }) => {
  return (
    <div className="playlist-item">
      {/* Thumbnail Image */}
      <img
        src={image}
        alt={title}
        className="thumbnail-image"
      />

      {/* Content Section */}
      <div className="content-section">
        <h3 className="item-title">
          {title}
        </h3>
        <p className="item-description">
          {description}
        </p>
      </div>
    </div>
  );
};

const Playlist = () => {
  const items = [
    {
      image: 'https://via.placeholder.com/150',
      title: 'Playlist Item 1',
      description: 'This is a description for the first playlist item.',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'Playlist Item 2',
      description: 'This is a description for the second playlist item.',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'Playlist Item 3',
      description: 'This is a description for the third playlist item.',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'Playlist Item 4',
      description: 'This is a description for the fourth playlist item.',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'Playlist Item 5',
      description: 'This is a description for the fifth playlist item.',
    },
    {
      image: 'https://via.placeholder.com/150',
      title: 'Playlist Item 6',
      description: 'This is a description for the sixth playlist item.',
    },
    {
        image: 'https://via.placeholder.com/150',
        title: 'Playlist Item 2',
        description: 'This is a description for the second playlist item.',
      },    
  ];

  return (
    <div className="playlist-container">
      {items.map((item, index) => (
        <MyLottoOrder
          key={index}
          image={item.image}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  );
};

export default Playlist;