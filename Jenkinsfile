def deploy(String remoteDirectory) {
  withCredentials([sshUserPrivateKey(credentialsId: 'deploy_web', keyFileVariable: 'keyfile', usernameVariable: 'username')]) {
    // Accept host key for server10: https://stackoverflow.com/questions/15174194/jenkins-host-key-verification-failed
    sh "tools/deploy/sftp-deploy.sh $remoteDirectory $username $keyfile"
  }
}

void checkoutWithSubmodules() {
  checkout([
    $class: 'GitSCM',
    branches: scm.branches,
    doGenerateSubmoduleConfigurations: false,
    extensions: [[
                   $class: 'SubmoduleOption',
                   disableSubmodules: false,
                   parentCredentials: true,
                   recursiveSubmodules: true,
                   reference: '',
                   trackingSubmodules: false
                 ]],
    submoduleCfg: [],
    userRemoteConfigs: scm.userRemoteConfigs
  ])
}

pipeline {
  agent any
  options {
    timeout(time: 1, unit: 'HOURS')
    skipDefaultCheckout()
  }

  stages {
    stage('Test') {
      steps {
        checkoutWithSubmodules()
        sh 'yarn'
        sh 'yarn run flow'
        sh 'yarn run lint'
        sh 'yarn run test --ci'
        sh 'yarn run test:coverage --ci'
      }
    }
    stage('Build') {
      steps {
        script {
          if (env.BRANCH_NAME == 'master') {
            sh 'yarn run build'

          } else {
            sh 'yarn run build:lib'
            sh 'yarn run build:debug'
          }
        }
        sh 'yarn run check:built'
      }
    }

    stage('Deploy') {
      steps {
        script {
          if (env.BRANCH_NAME == 'master') {
            deploy("/integreat.app")
          } else if (env.BRANCH_NAME == 'develop') {
            deploy("/webnext.integreat-app.de")
          } else {
            echo 'Only master and develop get deployed currently.'
          }
        }
      }
    }
  }

  post {
    always {
      sh 'tar cf www.tar.gz www/'
      archiveArtifacts artifacts: 'www.tar.gz', fingerprint: true
      junit 'junit.xml'

      step([
        $class              : 'CloverPublisher',
        cloverReportDir     : '__coverage__',
        cloverReportFileName: 'clover.xml',
        healthyTarget       : [methodCoverage: 70, conditionalCoverage: 80, statementCoverage: 80],
        unhealthyTarget     : [methodCoverage: 50, conditionalCoverage: 50, statementCoverage: 50],
        failingTarget       : [methodCoverage: 0, conditionalCoverage: 0, statementCoverage: 0]
      ])

      cleanWs()
    }
  }
}
