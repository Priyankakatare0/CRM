import React, { useState } from 'react';
import {
  ChartData,
  ChartOptions
} from 'chart.js';
import {
  Bar,
  Line,
  Pie,
  Radar,
  Doughnut
} from 'react-chartjs-2';
import {
  Tabs,
  Tab,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

interface Metrics {
  [key: string]: number[];
}

interface IndividualPerformance {
  name: string;
  metrics: Metrics;
}

interface PerformanceData {
  team: {
    labels: string[];
    productivity: number[];
    quality: number[];
    efficiency: number[];
  };
  individuals: {
    [id: number]: IndividualPerformance;
  };
}

const teamMembers: TeamMember[] = [
  { id: 1, name: 'John Doe', role: 'Developer', avatar: 'JD' },
  { id: 2, name: 'Jane Smith', role: 'Designer', avatar: 'JS' },
  { id: 3, name: 'Mike Johnson', role: 'QA', avatar: 'MJ' },
  { id: 4, name: 'Sarah Williams', role: 'Project Manager', avatar: 'SW' },
];

const performanceData: PerformanceData = {
  team: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    productivity: [75, 82, 78, 85, 90, 88],
    quality: [92, 95, 90, 93, 94, 96],
    efficiency: [80, 85, 82, 88, 87, 90],
  },
  individuals: {
    1: {
      name: 'John Doe',
      metrics: {
        tasksCompleted: [12, 15, 18, 20, 22, 25],
        codeQuality: [85, 88, 90, 92, 94, 95],
        bugsReported: [3, 2, 1, 2, 1, 0],
      },
    },
    2: {
      name: 'Jane Smith',
      metrics: {
        designsCompleted: [8, 10, 12, 15, 18, 20],
        clientApproval: [90, 92, 95, 96, 97, 98],
        revisions: [5, 4, 3, 2, 1, 1],
      },
    },
    3: {
      name: 'Mike Johnson',
      metrics: {
        testsCompleted: [25, 30, 35, 40, 45, 50],
        defectsFound: [15, 18, 20, 22, 25, 28],
        testCoverage: [75, 80, 85, 88, 90, 92],
      },
    },
    4: {
      name: 'Sarah Williams',
      metrics: {
        projectsDelivered: [1, 2, 3, 4, 5, 6],
        onTimeDelivery: [80, 85, 90, 92, 95, 97],
        teamSatisfaction: [75, 80, 85, 88, 90, 92],
      },
    },
  },
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  chartContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(3),
  },
  memberCard: {
    cursor: 'pointer',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  selectedMember: {
    backgroundColor: theme.palette.action.selected,
  },
}));

const PerformanceDashboard: React.FC = () => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMemberSelect = (memberId: number) => {
    setSelectedMember(memberId);
  };

  const getIndividualData = () => {
    if (!selectedMember) return null;

    const memberData = performanceData.individuals[selectedMember];
    const metrics = memberData.metrics;
    const metricKeys = Object.keys(metrics);

    return {
      lineData: {
        labels: performanceData.team.labels,
        datasets: metricKeys.map((key, index) => ({
          label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          data: metrics[key],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ][index],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ][index],
          borderWidth: 1,
        })),
      },
      doughnutData: {
        labels: metricKeys.map(key => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())),
        datasets: [
          {
            data: metricKeys.map(key => metrics[key][metrics[key].length - 1]),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
    };
  };

  const individualData = getIndividualData();

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Performance Dashboard
      </Typography>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Team Performance" />
        <Tab label="Individual Performance" />
      </Tabs>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.chartContainer}>
              <Typography variant="h6">Team Productivity Trend</Typography>
              <Bar data={{
                labels: performanceData.team.labels,
                datasets: [{
                  label: 'Productivity (%)',
                  data: performanceData.team.productivity,
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                  borderColor: 'rgba(54, 162, 235, 1)',
                  borderWidth: 1,
                }]
              }} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className={classes.chartContainer}>
              <Typography variant="h6">Team Quality Score Trend</Typography>
              <Line data={{
                labels: performanceData.team.labels,
                datasets: [{
                  label: 'Quality Score (%)',
                  data: performanceData.team.quality,
                  backgroundColor: 'rgba(75, 192, 192, 0.6)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                }]
              }} />
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography variant="h6">Select Team Member</Typography>
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className={`${classes.memberCard} ${selectedMember === member.id ? classes.selectedMember : ''}`}
                onClick={() => handleMemberSelect(member.id)}
              >
                <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar style={{ marginRight: '16px' }}>{member.avatar}</Avatar>
                  <div>
                    <Typography variant="subtitle1">{member.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{member.role}</Typography>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>

          <Grid item xs={12} md={9}>
            {selectedMember && individualData ? (
              <>
                <Typography variant="h5" gutterBottom>
                  {performanceData.individuals[selectedMember].name}'s Performance
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper className={classes.chartContainer}>
                      <Typography variant="h6">Performance Trends</Typography>
                      <Line data={individualData.lineData} />
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper className={classes.chartContainer}>
                      <Typography variant="h6">Current Month Metrics</Typography>
                      <Doughnut data={individualData.doughnutData} />
                    </Paper>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Paper className={classes.chartContainer}>
                <Typography variant="h6" align="center">
                  Please select a team member to view individual performance
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default PerformanceDashboard;
