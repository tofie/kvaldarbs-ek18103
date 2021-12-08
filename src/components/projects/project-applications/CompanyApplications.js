import { Col, Divider, notification, Row } from 'antd';
import React from 'react';
import { DateTime } from 'luxon';
import ShowMoreText from 'react-show-more-text';
import { useList } from 'react-firebase-hooks/database';
import { ref } from 'firebase/database';
import { auth, db } from '../../../misc/firebase';
import CompanyProjectApplicationCard from './CompanyProjectApplicationCard';

// component to show data about submitted projects
const CompanyApplications = ({
  title,
  about,
  reqs,
  startDate,
  endDate,
  deadline,
  projectID,
}) => {
  // fetching the project data from the database
  const projectApplicationRef = ref(
    db,
    `companies/${auth.currentUser.uid}/projects/${projectID}/applications`
  );

  const [applications, loading, error] = useList(projectApplicationRef);

  const projectInfo = (
    <>
      <Divider />
      <h1 className="text-xl">{title}</h1>
      <div className="pb-3">
        <b className="text-base">About:</b>
        <ShowMoreText lines={3} more="Show more" less="Show less">
          {about.split('\n').map(item => {
            return (
              <span>
                {item}
                <br />
              </span>
            );
          })}
        </ShowMoreText>
      </div>
      <div className="pb-5">
        <b className="text-base">Requirements:</b>
        <ShowMoreText lines={3} more="Show more" less="Show less">
          {reqs.split('\n').map(item => {
            return (
              <span>
                {item}
                <br />
              </span>
            );
          })}{' '}
        </ShowMoreText>
      </div>
      {/* <Divider /> */}
      <p>
        <b>Project starts:</b>{' '}
        {!startDate
          ? 'No specified start'
          : DateTime.fromISO(startDate).toFormat('dd.LL.yyyy')}
      </p>
      <p>
        <b>Project ends:</b>{' '}
        {!endDate
          ? 'No specified end'
          : DateTime.fromISO(endDate).toFormat('dd.LL.yyyy')}
      </p>
      <p>
        <b>Application deadline:</b>{' '}
        {!deadline
          ? 'No specified deadline'
          : DateTime.fromISO(deadline).toFormat('dd.LL.yyyy')}
      </p>
    </>
  );

  return (
    <div>
      <div>
        {projectInfo}
        {/* {console.log(DateTime.local().ts)} */}
        {error &&
          notification.error({
            message: 'An error has occured, try again later',
            duration: 4,
          })}
        {(!loading && !applications) ||
          (applications.length < 1 && (
            <>
              <div className="text-xl text-red-700">
                No applications received
              </div>
            </>
          ))}
        {!loading && applications && (
          <>
            <Row gutter={{ xs: 4, sm: 8 }} type="flex">
              {applications.map((application, index) => (
                <Col
                  key={index}
                  className="xl:w-1/3 md:w-1/2 sm:w-full  pt-2"
                  span={{ xs: 16, m: 8 }}
                >
                  <CompanyProjectApplicationCard
                    type={application.val().type}
                    about={application.val().about}
                    experience={application.val().experience}
                    motivation={application.val().motivation}
                    status={application.val().status}
                    cv={application.val().cv}
                    projectID={projectID}
                    companyID={auth.currentUser.uid}
                    applicantID={application.key}
                  />
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyApplications;
