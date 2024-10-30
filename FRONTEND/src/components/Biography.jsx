import React from 'react'

const Biography = ({imageUrl}) => {
  return (
    <div className='container biography'>
      <div className="banner">
        <img src={imageUrl} alt="aboutImg" />
      </div>
      <div className="banner">
        <p>Biography</p>
        <h3>Who We Are</h3>
       <p>
       Lifeline Healthcare Enterprise Limited, commonly known as Lifeline Healthcare, is a pioneering healthcare provider in India, renowned for setting benchmarks in clinical excellence and healthcare innovations.
       </p>
        <p>Founded in 2002 by Dr. Sandeep Chandra in Varanasi, Lifeline has blossomed into one of Asia's most trusted healthcare groups. It operates a vast network of hospitals, clinics, and pharmacies, offering a comprehensive spectrum of medical services including tertiary and quaternary care.</p>
        <p>Lifeline is particularly noted for its advancements in cardiology, oncology, neurosciences, and orthopedics, among other specialties.</p>
        <p> The group's commitment to leveraging cutting-edge technology and promoting medical research has significantly elevated the standard of healthcare in India.</p>
        <p>Lifeline also emphasizes medical education and training, ensuring a continual enhancement of its services and staff competencies, making it a cornerstone of healthcare in India and a significant player on the international healthcare stage.</p>

      </div>
    </div>
  )
}

export default Biography