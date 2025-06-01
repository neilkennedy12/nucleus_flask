import { Button } from "@mui/material";
import { PDFDownloadLink, Image } from "@react-pdf/renderer";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import logo from "./pdfLogo.png";
import logoGrey from "./logoGrey.png";
import header from "./Header.png";
import avenirHeavy from "./AvenirHeavy.ttf";
import avenirBlack from "./Avenir-Black-03.ttf";
import avenirMedium from "./Avenir-Medium-09.ttf";
import avenirBook from "./Avenir-Book-01.ttf";

const colors = {
  main: "#C00000",
};
const leftMargin = 70;
const paddingBottom = 60;
const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    fontFamily: "avenirMedium",
    paddingTop: 68,
    paddingBottom: paddingBottom,
    paddingHorizontal: leftMargin,
  },
  header: {
    display: "flex",
    backgroundColor: "gray",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    // height: 100,
  },
  headerText: {
    top: 20,
    left: leftMargin - 5,
    position: "absolute",
    fontFamily: "avenirMedium",
    fontSize: 24,
    color: "white",
  },
  subHeaderText: {
    marginTop: 10,
    fontSize: 10,
    color: colors.main,
    fontFamily: "avenirBlack",
  },
  section: {
    marginTop: 0,
    fontSize: 10,
  },
  image: {
    width: 75,
    height: 100,
    marginTop: 50,
    marginBottom: 20,
    marginLeft: -3,
  },
  footerInfo: {
    fontSize: 7,
    color: "black",
    display: "flex",
    position: "absolute",
    bottom: 60,
    left: leftMargin,
    right: leftMargin,
  },
  footerLeft: {
    fontSize: 7,
    color: "black",
    display: "flex",
    position: "absolute",
    bottom: 40,
    left: leftMargin,
  },
  footerRight: {
    fontSize: 7,
    color: "black",
    display: "flex",
    position: "absolute",
    bottom: 40,
    right: leftMargin,
  },
});

// Create Document Component
const MyDocument = ({
  question,
  answer,
  research,
  date,
}: {
  question: string;
  answer: string;
  research: any;
  date: any;
}) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Image src={header} />
      </View>
      <View style={styles.headerText}>
        <Text>RESEARCH QUERY</Text>
      </View>
      <View>
        <View style={styles.image}>
          <Image src={logo} />
        </View>
        <View style={styles.subHeaderText}>
          <Text>{"Date"}</Text>
        </View>
        <View style={styles.section}>
          <Text>{date}</Text>
        </View>
        <View style={styles.subHeaderText}>
          <Text>{"Query"}</Text>
        </View>
        <View style={styles.section}>
          <Text>{question}</Text>
        </View>
        <View style={styles.subHeaderText}>
          <Text>{"Answer"}</Text>
        </View>
        <View style={styles.section}>
          <Text>{answer}</Text>
        </View>
        <View style={styles.subHeaderText}>
          <Text>{"Reference Research"}</Text>
        </View>
        <View style={styles.section}>
          <Text>{research}</Text>
        </View>
      </View>
      <View style={styles.footerInfo}>
        <Image
          src={logoGrey}
          style={{
            width: 200,
            height: 300,
            position: "absolute",
            bottom: -paddingBottom,
            right: -leftMargin,
          }}
        />
        <Text>
          This response has been generated directly from the Nucleus Research
          database. It relies on analyst published research reports and
          benchmark data. For detailed information, or access to the underlying
          research, clients should contact customer support.
        </Text>
      </View>
      <View style={styles.footerLeft}>
        <Text>NucleusResearch.com</Text>
      </View>
      <View style={styles.footerRight}>
        <Text>Copyright Nucleus Research Inc.</Text>
      </View>
    </Page>
  </Document>
);
export const Download = ({
  question,
  answer,
  research,
}: {
  question: string;
  answer: string;
  research: any;
}) => {
  Font.register({
    family: "avenirMedium",
    src: avenirMedium,
  });
  Font.register({
    family: "avenirBook",
    src: avenirBook,
  });
  Font.register({
    family: "avenirBlack",
    src: avenirBlack,
  });
  Font.register({
    family: "avenirHeavy",
    src: avenirHeavy,
  });
  const date = new Date();
  const monthName = date.toLocaleString("default", { month: "short" });
  const today = `${monthName} ${date.getDate()}, ${date.getFullYear()}`;
  return (
    <div>
      <Button variant="outlined" color="primary">
        {question && research && answer && today && (
          <PDFDownloadLink
            document={
              <MyDocument
                question={question}
                answer={answer}
                research={research}
                date={today}
              />
            }
            style={{ color: colors.main, textDecoration: "none" }}
            fileName="NucleusAnswer.pdf"
          >
            {({ loading }) => (loading ? "Loading" : "Download PDF")}
          </PDFDownloadLink>
        )}
      </Button>
    </div>
  );
};
