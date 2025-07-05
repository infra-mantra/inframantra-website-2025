import React, { useState } from 'react';
// import './meetTheTeam.css';
import styles from './meattheTeam.module.css';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className={styles.tabPanelContent}>
          {children}
        </div>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function MeetTheTeam() {
  const [value, setValue] = useState(0);

  const handleChange = (index) => {
    setValue(index);
  };

  return (
    <>
      <div className={styles.meetTheTeamHeaderflex}>
        <h4>Meet The Team</h4>
      </div>
      <div className={styles.meetTheTeamContainer}>
        <div className={styles.tabsContainer}>
          <div
            className={`${styles.tab} ${value === 0 ? styles.selected : ''}`}
            onClick={() => handleChange(0)}
            {...a11yProps(0)}
          >
            Sales
          </div>
          <div
            className={`${styles.tab} ${value === 1 ? styles.selected : ''}`}
            onClick={() => handleChange(1)}
            {...a11yProps(1)}
          >
            Marketing
          </div>
          <div
           className={`${styles.tab} ${value === 2 ? styles.selected : ''}`}
            onClick={() => handleChange(2)}
            {...a11yProps(2)}
          >
            Operations
          </div>
          <div
            className={`${styles.tab} ${value === 3 ? styles.selected : ''}`}
            onClick={() => handleChange(3)}
            {...a11yProps(3)}
          >
            Finance
          </div>
          <div
           className={`${styles.tab} ${value === 4 ? styles.selected : ''}`}
            onClick={() => handleChange(4)}
            {...a11yProps(4)}
          >
            HR
          </div>
          <div
             className={`${styles.tab} ${value === 5 ? styles.selected : ''}`}
            onClick={() => handleChange(5)}
            {...a11yProps(5)}
          >
            IT Software
          </div>
          <div
             className={`${styles.tab} ${value === 6 ? styles.selected : ''}`}
            onClick={() => handleChange(6)}
            {...a11yProps(6)}
          >
            MRC
          </div>
        </div>
        <div className={styles.descriptionContainer}>
          <div className={styles.quoteIcon}>“</div>
          <TabPanel value={value} index={0}>
            <p className={styles.teamDescription}>
              Our Sales Team is experienced with deep knowledge
              of real estate market and properties, committed to understanding your
              unique needs and preferences. By providing personalized
              consultations and expert guidance, they ensure that you find the
              perfect property at the best location of the city.
            </p>
            <div className={styles.teamPhotoAboutUsWrapper}>
              <img
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/teamPhotos/3.avif"
                alt="team-photo"
                className={styles.teamPhotoAboutUs}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <p className={styles.teamDescription}>
              Our Marketing Team is the creative force that connects us with our
              clients. Their innovative approach ensures our brand stands out in
              a competitive market, reaching the right audience with the right
              message. From digital marketing to traditional advertising, our
              team employs a mix of tactics to generate buzz and drive
              engagement.
            </p>
            <div className={styles.teamPhotoAboutUsWrapper}>
              <img
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/teamPhotos/marketing%20team.avif"
                alt="team-photo"
                className={styles.teamPhotoAboutUs}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <p className={styles.teamDescription}>
              Our Operations Team ensures seamless transition from purchase to
              possession, providing continuous support every step of the way.
              Our goal is to build lasting relationships with our clients,
              ensuring they feel valued and supported long after they have made the
              purchase.
            </p>
            <div className={styles.teamPhotoAboutUsWrapper}>
              <img
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/teamPhotos/operations%20team.avif"
                alt="team-photo"
                className={styles.teamPhotoAboutUs}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <p className={styles.teamDescription}>
              Our Finance Department is a group of skilled professionals who
              manage our company`s financial health with precision and
              integrity. They are focused on ensuring fiscal responsibility,
              optimizing resources, and supporting sustainable growth, while
              aligning with our overall business goals.
            </p>
            <div className={styles.teamPhotoAboutUsWrapper}>
              <img
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/teamPhotos/finance%20team.avif"
                alt="team-photo"
                className={styles.teamPhotoAboutUs}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <p className={styles.teamDescription}>
              Our HR Team consists of dedicated professionals with a deep
              understanding of our company culture and employee needs. They are
              committed to fostering a supportive and inclusive environment,
              ensuring that each team member is valued and empowered.
            </p>
            <div className={styles.teamPhotoAboutUsWrapper}>
              <img
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/teamPhotos/4.avif"
                alt="team-photo"
                className={styles.teamPhotoAboutUs}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <p className={styles.teamDescription}>
              Our IT Software Team is the technological backbone that drives
              innovation and efficiency. They develop and maintain user-friendly
              digital infrastructure, ensuring seamless experiences for our
              clients and team. By integrating the latest technologies they keep
              us ahead in the competitive real estate market.
            </p>
            <div className={styles.teamPhotoAboutUsWrapper}>
              <img
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/teamPhotos/marketing%20team2.avif"
                alt="team-photo"
                className={styles.teamPhotoAboutUs}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={6}>
            <p className={styles.teamDescription}>
              Our MRC Team provide detailed information, answer queries, and
              offer personalized consultations to help clients make informed
              decisions. With in-depth knowledge of our properties and the
              market, they highlight the unique features and benefits of each
              project, ensuring that clients find the perfect fit for their
              needs.
            </p>
            <div className={styles.teamPhotoAboutUsWrapper}>
              <img
                src="https://inframantra.blr1.cdn.digitaloceanspaces.com/teamPhotos/mrc%20team.avif"
                alt="team-photo"
                className={styles.teamPhotoAboutUs}
              />
            </div>
          </TabPanel>
        </div>
      </div>
    </>
  );
}
